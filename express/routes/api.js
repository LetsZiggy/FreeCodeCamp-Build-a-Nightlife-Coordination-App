const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const createID = require('./services/create-id.js');
const handlePassword = require('./services/handle-password.js');

const dbURL = `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBURL}/${process.env.DBNAME}`;

module.exports = router;
