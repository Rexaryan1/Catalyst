const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const promptSchema = new Schema({
  promptId: ObjectId,
  prompt: String,
  reply: String
});

const Prompt = mongoose.model('prompts', promptSchema);

module.exports = Prompt