const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();


app.use(express.json());
app.use(cors());


const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v8mjz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const ObjectId = require('mongodb').ObjectId;


client.connect(err => {
  const collection = client.db("carfixer").collection("services");
  const adminCollection = client.db("carfixer").collection("admins");
  const reviewCollection = client.db("carfixer").collection("reviews");
  const orderCollection = client.db("carfixer").collection("orders");
  const quotationCollection = client.db("carfixer").collection("quotation");

  // perform actions on the collection object

  //get all
  app.get('/services', (req, res) => {

    collection.find()
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  //create new service info
  app.post('/addService', (req, res) => {

    const newService = req.body;
    collection.insertOne(newService)
      .then(result => {

        res.send(result.insertedCount > 0);
      })



  })


  //fetch single service
  app.get('/service/:id', (req, res) => {
    collection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })



  //delete service
  app.delete('/delete/:id', (req, res) => {
    ;
    collection.deleteOne({ _id: ObjectId(req.params.id) })
      .then((err, result) => {
        res.send('book deleted successfully')
      })
  })


  //order create
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0);
      })

  })






  //create review
  app.post('/addReview', (req, res) => {

    const review = req.body;
    reviewCollection.insertOne(review)
      .then(result => {
        res.send(result.insertedCount > 0);
      })


  })

  //get reviews

  app.get('/reviews', (req, res) => {

    reviewCollection.find()
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  //create admin
  app.post('/addAdmin', (req, res) => {

    const admin = req.body;
    adminCollection.insertOne(admin)
      .then(result => {
        res.send(result.insertedCount > 0);
      })


  })


  //create quotation
  app.post('/addQuotation', (req, res) => {

    const appointment = req.body;
    quotationCollection.insertOne(appointment)
      .then(result => {
        res.send(result.insertedCount > 0);
      })


  })

  //all quotation
  app.get('/quotation', (req, res) => {

    quotationCollection.find()
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  //all orders
  app.get('/orders', (req, res) => {

    orderCollection.find()
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  //admin filter
  app.get('/admins/:email', (req, res) => {

    adminCollection.find({ email: req.params.email })
      .toArray((err, documents) => {
        res.send(documents);
      })

  })


  //conditional fetch
  app.get('/orders/:email', (req, res) => {

    orderCollection.find({ email: req.params.email })
      .toArray((err, documents) => {
        res.send(documents);
      })

  })



  //update service
  app.patch('/update/:id', (req, res) => {

    orderCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: { status: req.body.status }
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  })




  console.log('db connected');

  //client.close();
});


app.get('/', (req, res) => {

  res.send('express server started');
})


app.listen(process.env.PORT || port);