var express = require('express');
var router = express.Router();
var Prompt = require('../models/prompt');
const User = require('../models/user');

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now())
  next()
}
router.use(timeLog)

/* GET users listing. */
router.post('/', async function(req, res, next) {
  if(req.body.username) result = await User.findOneAndUpdate(
    {username: req.body.username},
    {$push: { prompts: req.body.prompt }});
  const response = await Prompt.promptJson(req.body.prompt);
  res.send(response);
});

module.exports = router;
