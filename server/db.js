const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require("dotenv");

dotenv.config();

const connectionString = "";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(connectionString,{ serverApi: {
  version: ServerApiVersion.v1,
  strict: true,
  deprecationErrors: true,
}});

async function run() {
  try {
    client.connect();
    console.log("You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

module.exports = client;