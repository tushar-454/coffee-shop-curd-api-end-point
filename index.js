const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@karim.mjbii6i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeDBCollection = client.db('coffeeDB').collection('coffees');

    // for get all coffees
    app.get('/coffees', async (req, res) => {
      const cursor = coffeeDBCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // fot get one coffee by id
    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeDBCollection.findOne(query);
      res.send(result);
    });
    // create a coffee
    app.post('/coffees', async (req, res) => {
      const coffee = req.body;
      const result = await coffeeDBCollection.insertOne(coffee);
      res.send(result);
    });
    // delete a coffee by id
    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await coffeeDBCollection.deleteOne(filter);
      res.send(result);
    });
    // update a coffee by id
    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const updateCoffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const coffeeUpdateSet = {
        $set: {
          name: updateCoffee.name,
          quentity: updateCoffee.quentity,
          price: updateCoffee.price,
          test: updateCoffee.test,
          madeBy: updateCoffee.madeBy,
          supply: updateCoffee.supply,
        },
      };
      const result = coffeeDBCollection.updateOne(
        filter,
        coffeeUpdateSet,
        options
      );
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/health', (req, res) => {
  res.send('Api is working fine');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
