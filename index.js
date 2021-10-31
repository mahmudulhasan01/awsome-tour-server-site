
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
require('dotenv').config();

const express = require('express');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 5000;

// Middelware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d3pnh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)

async function run(){
    try{
        await client.connect();
        const database = client.db("tourism");
        const tourCollection = database.collection("places");
        const facilitiesCollection = database.collection("facilitis");
        const usersCollection = database.collection("users");

        
        // GET API
        app.get('/places', async(req, res) => {
          const cursor = tourCollection.find({});
          const places = await cursor.toArray();
          res.send(places);
        });
        
        //   GET Singel places
        app.get('/places/:id', async(req, res) => {
          const id = req.params.id;
          const query = { _id: objectId(id) };
          const service = await tourCollection.findOne(query);
          res.send(service);
        });        
        
        // GET API For Facilities
        app.get('/facilities', async(req, res) => {
          const cursor = facilitiesCollection.find({});
          const facilitis = await cursor.toArray();
          res.send(facilitis);
        });
        
        // POST API
        app.post('/places', async (req, res) => {
          const places = req.body
          const result = await tourCollection.insertOne(places);
          res.json(result)
        });

        // POST API
        app.post('/users', async (req, res) => {
          const users = req.body
          const result = await usersCollection.insertOne(users);
          console.log('hit The post')
          res.json(result)
        });
        
    }
    finally{
        // await client.close
    }

};
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});