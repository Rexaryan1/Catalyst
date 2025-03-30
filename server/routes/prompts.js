var express = require('express');
var router = express.Router();
var Prompt = require('../models/prompt');

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now())
  next()
}
router.use(timeLog)

/* GET users listing. */
router.post('/', function(req, res, next) {
  Prompt.prompt(req.body);
  res.send('respond with a resource');

});

module.exports = router;
