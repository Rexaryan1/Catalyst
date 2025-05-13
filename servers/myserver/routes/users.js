var express = require('express');
var router = express.Router();
var User = require('../models/user');

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now())
  next()
}
router.use(timeLog)

router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from MongoDB
    res.json(users); // Send as JSON response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/',async (req, res) => {
  try {
    if(!req.body.username) res.status(400).json({message : "Please send a 'username'"});
    var result = await User.insertOne(req.body);
    res.json(result); // Send as JSON response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
