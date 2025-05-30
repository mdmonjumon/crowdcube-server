require('dotenv').config()
const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xt5rphe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // data collections
    const campaignCollection = client.db('campaignCollectionDB').collection('campaigns')
    const userCollections = client.db('campaignCollectionDB').collection('users')
    const donatedCollections = client.db('campaignCollectionDB').collection('donates')


    //api for read all campaign
    app.get('/allCampaign', async (req, res) => {
      const result = await campaignCollection.find().toArray();
      res.send(result);
    })


    // api for get all donation 
    app.get('/donations', async (req, res) => {
      const result = await donatedCollections.find().toArray();
      res.send(result);
    })

    // api for get single donation 
    app.get('/donations/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await donatedCollections.findOne(query)
      res.send(result);
    })

    //api for read six running campaign
    app.get('/runningCampaign', async (req, res) => {
      const today = new Date().toISOString()
      const query = { deadline: { $gte: today } }
      const result = await campaignCollection.find(query).limit(6).toArray()
      res.send(result)
    })



    // api for read single campaign data
    app.get('/campaign/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await campaignCollection.findOne(query);
      res.send(result);
    })

    // api for read donated data for each user
    app.get('/donates', async (req, res) => {
      const result = await donatedCollections.find().toArray();
      res.send(result);
    })


    // get all user api
    app.get('/users', async (req, res) => {
      const result = await userCollections.find().toArray();
      res.send(result)
    })


    //api for add new campaign
    app.post('/addCampaign', async (req, res) => {
      const result = await campaignCollection.insertOne(req.body);
      res.send(result);
    })

    // api for store donated data
    app.post('/donates', async (req, res) => {
      const result = await donatedCollections.insertOne(req.body);
      res.send(result);
    })


    // add new user api
    app.post('/users', async (req, res) => {
      const result = await userCollections.insertOne(req.body);
      res.send(result);
    })



    // delete single campaign data from allCampaign
    app.delete('/campaign/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await campaignCollection.deleteOne(query);
      res.send(result)
    })


    // update campaign
    app.put('/campaign/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const info = req.body;
      const option = { upsert: true }
      const updateInfo = {
        $set: {
          photo: info.photo,
          title: info.title,
          campaignType: info.campaignType,
          description: info.description,
          donateAmount: info.donateAmount,
          deadline: info.deadline,
          userEmail: info.userEmail,
          userName: info.userName,
        }
      }

      const result = await campaignCollection.updateOne(filter, updateInfo, option)
      res.send(result)

    })

  } finally {

  }
}


app.get('/', (req, res) => {
  res.send('crowdcube server data')
})


app.listen(port, () => {
 
})

run()
