const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pr0er.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("tourBooking");
      const servicesCollection = database.collection("services");
      const orderCollection = database.collection("orders");
      const userCollection = database.collection("users");

    
    // get api for all services
app.get('/services', async(req,res)=>{
    const cursor = servicesCollection.find({});
    const services = await cursor.toArray();
    res.send(services);
  });

  // get single service 
app.get('/services/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const service = await servicesCollection.findOne(query);
    res.json(service);
  
  })

  // get api for all orders 
  app.get('/orders', async(req,res)=>{
    const cursor = orderCollection.find({});
   const orders = await cursor.toArray();
   res.send(orders);
  });
      
    //  post api 

    app.post('/services', async(req,res)=>{
        const service = req.body;
          const result = await servicesCollection.insertOne(service);
           console.log(result);
        res.json(result);
    })

    // post api for ordering  
app.post('/orders', async(req,res)=>{
    const item = req.body;
    console.log('hit the post api again',item);
  
    const result = await orderCollection.insertOne(item);
     res.json(result)
  
  });

  // post all the users info 
app.post('/users', async(req,res)=>{
    const user = req.body;
    const result = await userCollection.insertOne(user);
    console.log(result);
    res.json(result);
  })

 // test 
 app.get('/myOrders/:email', async(req,res)=>{
     const result = await orderCollection.find({email:req.params.email}).toArray();
      res.send(result);
  
   });
    
    } 
    finally {
     
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('This is our node project')
})
app.get('/hello', (req, res) => {
  res.send('This is hello');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})