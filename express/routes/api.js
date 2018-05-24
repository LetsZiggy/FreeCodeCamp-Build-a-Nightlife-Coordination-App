const https = require('https');
const qs = require('querystring');
const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const createID = require('./services/create-id.js');
const handleHashing = require('./services/handle-hashing.js');

const dbURL = `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBURL}/${process.env.DBNAME}`;

router.post('/businesses', async (req, res, next) => {
  let location = {};
  let body = [];
  if(req.body.location) {
    location.location = req.body.location;
  }
  else {
    location.latitude = req.body.latitude;
    location.longitude = req.body.longitude;
  }

  const request = await https.request(
    {
      host: `api.yelp.com`,
      path: `/v3/businesses/search?categories=restaurants&${qs.stringify(location)}`,
      headers: {
        Accept: 'application/json',
        Authorization: process.env.YELP
      }
    },
    async (response) => {
      response.setEncoding('utf8');
      response.on('data', (data) => {
        body.push(data.toString());
      });

      response.on('end', async () => {
        let businesses = JSON.parse(body.join('')).businesses;
        let businessIDs = businesses.map((v, i, a) => v.id);

        let client = await mongo.connect(dbURL);
        let db = await client.db(process.env.DBNAME);
        let collectionRSVPs = await db.collection('build-a-nightlife-coordination-app-rsvp');
        let find = await collectionRSVPs.find({ id: { $in: businessIDs } }, { projection: { _id: 0 } }).toArray();
        client.close();

        let goingUser = [];
        let dateNow = new Date();
        let goingTotal = find.reduce((acc, v, i, a) => {
          let total = 0;
          Object.entries(v.users).forEach(([key, value]) => {
            let dateUser = new Date(value);
            if(dateUser > dateNow) {
              total++;

              if(req.cookies.id === key) {
                goingUser.push(v.id);
              }
            }
          });
          acc[v.id] = total;
          return(acc);
        }, {});

        res.json({ businesses: businesses, goingTotal: goingTotal, goingUser: goingUser });
      });
  });

  request.on('error', (err) => { console.log(err); throw err; });
  request.end();
});

router.post('/goingUser', async (req, res, next) => {
  let client = await mongo.connect(dbURL);
  let db = await client.db(process.env.DBNAME);
  let collectionRSVPs = await db.collection('build-a-nightlife-coordination-app-rsvp');
  let find = await collectionRSVPs.find({ id: { $in: req.body.businessIDs } }, { projection: { _id: 0 } }).toArray();
  client.close();

  let dateNow = new Date();
  let goingUser = find.reduce((acc, v, i, a) => {
    Object.entries(v.users).forEach(([key, value]) => {
      let dateUser = new Date(value);
      if(dateUser > dateNow && req.cookies.id === key) {
        acc.push(v.id);
      }
    });

    return(acc);
  }, []);

  res.json({ goingUser: goingUser });
});

router.post('/rsvp/set', async (req, res, next) => {
  let query = `users.${req.cookies.id}`;
  let date = new Date();
  date.setDate(date.getDate() + 1);

  let client = await mongo.connect(dbURL);
  let db = await client.db(process.env.DBNAME);
  let collectionRSVPs = await db.collection('build-a-nightlife-coordination-app-rsvp');
  let update = await collectionRSVPs.updateOne(
    { id: req.body.business },
    { $set: { [query]: date } },
    { upsert: true }
  );
  client.close();

  res.json({ update: true });
});

router.post('/rsvp/unset', async (req, res, next) => {
  let query = `users.${req.cookies.id}`;

  let client = await mongo.connect(dbURL);
  let db = await client.db(process.env.DBNAME);
  let collectionRSVPs = await db.collection('build-a-nightlife-coordination-app-rsvp');
  let update = await collectionRSVPs.updateOne(
    { id: req.body.business },
    { $unset: { [query]: '' } }
  );
  client.close();

  res.json({ update: true });
});

router.post('/user/checkname', async (req, res, next) => {
  let client = await mongo.connect(dbURL);
  let db = await client.db(process.env.DBNAME);
  let collectionIDs = await db.collection('build-a-nightlife-coordination-app-ids');
  let findID = await collectionIDs.findOne({ type: 'users' }, { projection: { _id: 0, type: 0 } });
  client.close();

  let takenUsernames = Object.entries(findID).map((v, i, a) => v[1]);
  if(takenUsernames.indexOf(req.body.username) === -1) {
    res.json({ taken: false });
  }
  else {
    res.json({ taken: true });
  }
});

router.post('/user/create', async (req, res, next) => {
  if(!req.cookies.id) {
    let data = {};
    data.username = req.body.username;
    data.email = handleHashing(req.body.email);
    data.password = handleHashing(req.body.password);

    let client = await mongo.connect(dbURL);
    let db = await client.db(process.env.DBNAME);
    let collectionIDs = await db.collection('build-a-nightlife-coordination-app-ids');
    let findID = await collectionIDs.findOne({ type: 'users' }, { projection: { _id: 0, type: 0 } });
    let id = createID(findID.list);
    data.id = id;
    let query = `list.${id}`;
    let insertID = await collectionIDs.findOneAndUpdate({ type: 'users' }, { $set: { [query]: req.body.username } });
    let collectionUsers = await db.collection('build-a-nightlife-coordination-app-users');
    let insertUser = await collectionUsers.insertOne(data);
    client.close();

    let date = new Date();
    date.setDate(date.getDate() + 1);
    // res.cookie('id', id, { expires: date, path: '/', httpOnly: true });
    res.cookie('id', id, { expires: date, path: '/', httpOnly: true, secure: true });
    res.json({ create: true, expire: (date.getTime()) });
  }
  else {
    // res.cookie('id', '', { expires: new Date(), path: '/', httpOnly: true });
    res.cookie('id', '', { expires: new Date(), path: '/', httpOnly: true, secure: true });
    res.json({ create: false });
  }
});

router.post('/user/login', async (req, res, next) => {
  if(!req.cookies.id) {
    let client = await mongo.connect(dbURL);
    let db = await client.db(process.env.DBNAME);
    let collectionUsers = await db.collection('build-a-nightlife-coordination-app-users');
    let findUser = await collectionUsers.findOne({ username: req.body.username });
    client.close();

    if(!findUser) {
      res.json({ get: false });
    }
    else {
      let password = await handleHashing(req.body.password, findUser.password.salt);

      if(password.hash !== findUser.password.hash) {
        res.json({ get: false }); 
      }
      else {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        // res.cookie('id', findUser.id, { expires: date, path: '/', httpOnly: true });
        res.cookie('id', findUser.id, { expires: date, path: '/', httpOnly: true, secure: true });
        res.json({ get: true, expire: (date.getTime()) });
      }
    }
  }
  else {
    // res.cookie('id', '', { expires: new Date(), path: '/', httpOnly: true });
    res.cookie('id', '', { expires: new Date(), path: '/', httpOnly: true, secure: true });
    res.json({ get: false });
  }
});

router.post('/user/logout', async (req, res, next) => {
  // res.cookie('id', '', { expires: new Date(), path: '/', httpOnly: true });
  res.cookie('id', '', { expires: new Date(), path: '/', httpOnly: true, secure: true });
  res.json({ logout: true });
});

router.post('/user/edit', async (req, res, next) => {
  if(!req.cookies.id) {
    let client = await mongo.connect(dbURL);
    let db = await client.db(process.env.DBNAME);
    let collectionUsers = await db.collection('build-a-nightlife-coordination-app-users');
    let findUser = await collectionUsers.findOne({ username: req.body.username });
    let email = await handleHashing(req.body.email, findUser.email.salt);

    if(!findUser || email.hash !== findUser.email.hash) {
      client.close();
      res.json({ update: false });
    }
    else {
      let password = await handleHashing(req.body.password);
      let updateUser = await collectionUsers.updateOne({ username: req.body.username }, { $set: { password: { hash: password.hash, salt: password.salt } } });
      client.close();

      let date = new Date();
      date.setDate(date.getDate() + 1);
      // res.cookie('id', findUser.id, { expires: date, path: '/', httpOnly: true });
      res.cookie('id', findUser.id, { expires: date, path: '/', httpOnly: true, secure: true });
      res.json({ update: true, expire: (date.getTime()) });
    }
  }
  else {
    // res.cookie('id', '', { expires: new Date(), path: '/', httpOnly: true });
    res.cookie('id', '', { expires: new Date(), path: '/', httpOnly: true, secure: true });
    res.json({ update: false });
  }
});

module.exports = router;
