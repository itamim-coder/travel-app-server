const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
// const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.srriw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
  try{
      await client.connect();
      const database = client.db("travelApp");
      const packagesCollection = database.collection("packages");
      const ordersCollection = database.collection("confirmOrder");
     
     
      //GET Packages
          app.get('/packages', async (req, res) => {
          const cursor = packagesCollection.find({});
          const result = await cursor.toArray();
          res.send(result);            
      })

        
              //   Post Order
          app.post("/confirmOrder", async(req,res) =>{
              const result = await ordersCollection.insertOne(req.body);
              res.send(result)
          }) 
                // User Order
          app.get("/myorder/:email", async (req, res) =>{
              const result = await ordersCollection
              .find({ email: req.params.email })
              .toArray();
              res.send(result);
          })   
      


      console.log('connected database travelApp')

  }
  finally{
      //await client.close();
  }

}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on ${port}`)
})