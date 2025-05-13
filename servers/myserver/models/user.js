const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  userId: ObjectId,
  username: String,
  firstName: String,
  lastName: String,
  prompts: Array
});

const User = mongoose.model('users', userSchema);

module.exports = User