const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  userId: ObjectId,
  username: String
});

const User = mongoose.model('users', userSchema);

module.exports = User