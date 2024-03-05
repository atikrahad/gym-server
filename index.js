const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port =process.env.PORT | 5000


app.use(express.json())
app.use(cors())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1lk0tsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const userCollection = client.db('GymDB').collection('users')
    
    app.get('/user', async(req, res)=>{
      const getEmail = req.query.email;
      const result = await userCollection.findOne({email: getEmail})
      res.send(result)
    })

    app.post('/user', async(req, res)=>{
        const userInfo = req.body;
        const result = await userCollection.insertOne(userInfo)
        res.send(result)
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res)=> {
    res.send("Server is open")
})
app.listen(port, ()=>{
    console.log(port,'is running');
})