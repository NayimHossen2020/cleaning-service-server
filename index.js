const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.edzwt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const servicesCollection = client.db("cleanCo").collection("services");

        app.get('/get-services', async (req, res) => {
            const services = await servicesCollection.find({}).toArray()
            res.send(services);
        });

        app.post('/add-services', async (req, res) => {
            const data = req.body;
            const result = await servicesCollection.insertOne(data)
            res.send(result);
        })

        app.put('/update-service/:id', async (req, res) => {
            const { id } = req.params;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = { $set: data }
            const option = { upsert: true };

            const result = await servicesCollection.updateOne(filter, updateDoc, option);
            res.send(result)
        });

        app.delete('/delete-service/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result)
        });

        // app.post('/add-services', async (req, res) => {
        //     try {
        //         const data = req.body;
        //         const result = await servicesCollection.insertOne(data)
        //         res.send({ status: true, result: result });
        //     } catch (error) {
        //         res.send({ status: false, error })
        //     }
        // })

    } finally {

    }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('Hello To CleanCo');
})

//body
app.get('/dummy/user2', async (req, res) => {
    const { name, age, email } = req.body;
    console.log(name, age, email);
    res.json(email)
})

//query
app.get('/dummy/user', async (req, res) => {
    const { name, age } = req.query;
    console.log(name);
    console.log(age);
    res.json(name);
})

//params
app.get('/dummy/user/:id', async (req, res) => {
    const { id } = req.params;
    res.json(id);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})