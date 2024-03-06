const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT | 5000;

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1lk0tsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const userCollection = client.db("GymDB").collection("users");
    const articleCollection = client.db("GymDB").collection("articles");
    const commentsCollection = client.db("GymDB").collection("comments");
    const applicationCollection = client.db("GymDB").collection("application");

    app.get("/user", async (req, res) => {
      const getEmail = req.query.email;
      const result = await userCollection.findOne({ email: getEmail });
      res.send(result);
    });

    app.get("/articles", async (req, res) => {
      const result = await articleCollection.find().toArray();
      res.send(result);
    });

    app.get("/recentblog", async (req, res) => {
      const result = await articleCollection
        .find()
        .sort({ _id: -1 })
        .limit(4)
        .toArray();
      res.send(result);
    });

    app.get('/article/:id', async(req, res)=>{
      const ids = req.params.id;
      const result = await articleCollection.findOne({_id: new ObjectId(ids)})
      res.send(result)
    })

    app.get('/comments', async(req, res)=> {
      const ids = req.query.ids
      const result = await commentsCollection.find({blogsId: ids}).toArray()
      res.send(result)
    })

    app.get("/applications", async(req, res)=>{
      const result =await applicationCollection.find().toArray()
      res.send(result)
    })

    app.put("/updateprofile", async(req, res) => {
      const info = req.body;
      const query = req.query.email;
      const getQuery = {email: query}
      const option = {upsert: true}
      const update = {
        $set: {
          bio: info.bio,
          country: info.country,
          phone: info.phone,
          gender: info.gender,
          address: info.address,
          coverpic: info.coverpic,
          name: info.name,
        }
      }
      const result = await userCollection.updateOne(getQuery, update, option)
      res.send(result)
    })

    app.post("/user", async (req, res) => {
      const userInfo = req.body;
      const result = await userCollection.insertOne(userInfo);
      res.send(result);
    });

    app.post("/article", async (req, res) => {
      const userInfo = req.body;
      const result = await articleCollection.insertOne(userInfo);
      res.send(result);
    });

    app.post("/comment", async(req, res)=>{
      const coment = req.body;
      const result = await commentsCollection.insertOne(coment)
      res.send(result)
    })

    app.post("/application", async(req, res)=> {
      const info = req.body
      const result = await applicationCollection.insertOne(info)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is open");
});
app.listen(port, () => {
  console.log(port, "is running");
});
