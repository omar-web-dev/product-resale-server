const jwt = require('jsonwebtoken')
const express = require('express')
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-s4fqikr-shard-00-00.uadalh8.mongodb.net:27017,ac-s4fqikr-shard-00-01.uadalh8.mongodb.net:27017,ac-s4fqikr-shard-00-02.uadalh8.mongodb.net:27017/?ssl=true&replicaSet=atlas-6gg0lv-shard-0&authSource=admin&retryWrites=true&w=majority`;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uadalh8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('aspen-home').collection('users')
        const productCollection = client.db('aspen-home').collection('product')
        const categoryCollection = client.db('aspen-home').collection('categorize')
        const bookingCollection = client.db('aspen-home').collection('booking')

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });


        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });


        app.post('/add-product', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });

        app.get('/product', async (req, res) => {
            const query = {};
            const products = await productCollection.find(query).toArray();
            res.send(products);
        });

        app.get('/product/category', async (req, res) => {
            let query = {}
            if (req.query.category) {
                query = {
                    category : req.query.category
                }
            }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/my-product', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/add-product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        app.delete('/delete-user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })
       
        // app.get('/services', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const service = await productCollection.find(query);
        //     res.send(service);
        // });

        // http://localhost:5000/product/:id?id=638313bad66fd19d66bcce7f
        app.get('/product/:id', async (req, res) => {
            let query = {}
            const id = req.query.id;
            query = { _id: ObjectId(id) };
            const cursor = await productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.patch('/add-product/:id', async (req, res) => {
            const id = req.params.id
            const massage = req.body.massage
            const review = req.body.review
            const query = { _id: ObjectId(id) }
            const updated = { $set: { massage, review } }
            const result = await productCollection.updateMany(query, updated)
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        app.get('/users/admin/:email', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = usersCollection.find(query)
            const admin = await cursor.toArray()
            res.send({ isAdmin: admin[0]?.userStatus === 'admin' });
        })

        // app.get('/users/buyer', async (req, res) => {
        //     let query = {}
        //     if (req.query.email) {
        //         query = {
        //             email: req.query.email
        //         }
        //     }
        //     const buyer = await usersCollection.find(query)
            
        //     res.send({ isBuyer : buyer.userStatus === 'buyer' });
        // })


        app.get('/users/buyer', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = await usersCollection.findOne(query)
            
            // const seller = await cursor.toArray()
            res.send({ isBuyer : cursor.userStatus === 'buyer' });
        })

        app.get('/users/seller', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = await usersCollection.findOne(query)
            
            // const seller = await cursor.toArray()
            res.send({ isSeller : cursor.userStatus === 'seller' });
        })
    
        
        app.get('/buyer', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    userStatus : req.query.email
                }
            }
            const cursor = usersCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/booking', async (req, res) => {
            let query = {}
            console.log(req.query.userEmail)
            if (req.query.userEmail) {
                query = {
                    userEmail : req.query.userEmail
                }
            }
            const cursor = bookingCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        

        app.get('/rule', async (req, res) => {
            let query = {}
            if (req.query.userStatus) {
                query = {
                    userStatus: req.query.userStatus
                }
            }
            const cursor = usersCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/users-email', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = usersCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/buyer-email', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = usersCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get('/jwt', async (req, res) => {
            const userMail = req.query.email
            const query = { email: userMail }
            const result = await usersCollection.findOne(query)
            if (result) {
                const token = jwt.sign({ email: userMail }, process.env.TOKEN, { expiresIn: '23h' })
                return res.send({ accessToken: token })
            }
            res.status(403).send({ assesToken: '' })
        })

        app.get('/users-role', async (req, res) => {
            let query = {}
            if (req.query.userStatus) {
                query = {
                    userStatus: req.query.userStatus,
                }
            }
            const cursor = usersCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        
        app.get('/categorize', async (req, res) => {
            const query = {};
            const category = await categoryCollection.find(query).toArray();
            res.send(category);
        })



    } catch (error) {
        console.log(error)
    }
}

run()

app.get('/', async (req, res) => {
    res.send('Aspen Home server is running')
})

app.listen(port, () => console.log('server is running', port))