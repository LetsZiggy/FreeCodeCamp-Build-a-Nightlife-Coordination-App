const express = require('express');
const router = express.Router();
const path = require('path');

// Path to be changed on deployment
router.get('/scripts/:filename', (req, res, next) => res.sendFile(path.join(__dirname, `../../aurelia/scripts/${req.params.filename}`)));

router.get('/', (req, res, next) => {
  // let date = new Date();
  // date.setDate(date.getDate() + 1);
  // res.cookie('ipinfo', process.env.IPINFO, { expires: date, path: '/' });
  // res.cookie('ipinfo', process.env.IPINFO, { expires: date, path: '/', secure: true });
  res.render('index', { title: 'Express' });
});

module.exports = router;
