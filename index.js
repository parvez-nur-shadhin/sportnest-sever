const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
dotenv.config();
const app = express();
const port = process.env.PORT;
const uri = process.env.MONGODB_URI;
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("sportnest");
    const facilitiesCollection = database.collection("facilities");

    app.get("/facilities", async (req, res) => {
      const result = await facilitiesCollection.find().toArray();
      res.json(result);
    });
    app.post("/facilities", async (req, res) => {
      const newFacility = await req.body;
      const result = await facilitiesCollection.insertOne(newFacility);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The Server is Open.");
});

app.listen(port, () => {
  console.log(`The server is running at ${port}`);
});
