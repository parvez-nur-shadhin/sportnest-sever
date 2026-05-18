const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const bookingsCollection = database.collection("bookings");

    app.get("/facilities", async (req, res) => {
      const result = await facilitiesCollection.find().toArray();
      res.json(result);
    });
    app.post("/facilities", async (req, res) => {
      const newFacility = await req.body;
      const result = await facilitiesCollection.insertOne(newFacility);
      res.send(result);
    });
    app.get("/bookings", async (req, res) => {
      const result = await bookingsCollection.find().toArray();
      res.json(result);
    });
    app.post("/bookings", async (req, res) => {
      const newBooking = await req.body;
      const result = await bookingsCollection.insertOne(newBooking);
      res.send(result);
    });

    app.get("/bookings/:id", async (req, res) => {
      const { id } = req.params;
      const result = await bookingsCollection.find({
        _id: new ObjectId(id),
      }).toArray();
      res.send(result);
    });

    app.delete("/bookings/:id", async (req, res) => {
      const { id } = req.params;
      const result = await bookingsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
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
