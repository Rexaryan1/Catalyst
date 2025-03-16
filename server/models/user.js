const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userModel = new Schema({
  userId: ObjectId,
  name: String,
  description: String,
  dateOfCreation: Date
});

module.export = userModel