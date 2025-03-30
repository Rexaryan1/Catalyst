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
router.post('/', async function(req, res, next) {
  const response = await Prompt.promptJson(req.body.prompt);
  res.send(response);
});

module.exports = router;
