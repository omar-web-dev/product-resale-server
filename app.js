const jwt = require('jsonwebtoken')
const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uadalh8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        const usersCollection = client.db('aspen-home').collection('users')
        const productCollection = client.db('aspen-home').collection('product')

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.post('/add-product', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });

        app.get('/add-product', async (req, res) => {
            const query = {};
            const products = await productCollection.find(query).toArray();
            res.send(products);
        });

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });


        app.get('/jwt', async(req,res) => {
            const userMail = req.query.email
            const query = {email : userMail}
            const result = await usersCollection.findOne(query)
            if(result){
                const token = jwt.sign({email: userMail}, process.env.TOKEN, {expiresIn : '23h'})
                return res.send({accessToken : token})
            }
            res.status(403).send({assesToken: ''})
        })
        
    } catch (error) {
        console.log(error)
    }
}

run()

app.get('/',async(req,res)=> {
    res.send('Aspen Home server is running')
})

app.listen(port, ()=> console.log('server is running', port))