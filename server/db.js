const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectionString = "";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
async function run() {
  try {
    await mongoose.connect(userConnectionString);
    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
run().catch(console.dir);

module.exports = mongoose;