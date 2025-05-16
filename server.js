require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userHandler = require('./Routes/UserRoute')
const categoryHandler = require('./Routes/categoryRoute')
const servicesHandler = require('./Routes/servicesRoute')
const teamHandler = require('./Routes/teamRoute')
const cartHandler = require('./Routes/cartRoute')
const app = express()

const port = process.env.SERVER_PORT || 3000;
const host = process.env.SERVER_IP || "103.145.138.116";


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.bnga9lj.mongodb.net/r2ait_db?retryWrites=true&w=majority&appName=Cluster0`;


mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('server is running...')
})
app.use('/users', userHandler)
app.use('/categories', categoryHandler)
app.use('/services', servicesHandler)
app.use('/teams', teamHandler)
app.use('/cart', cartHandler)

app.listen(port, host, ()=> {
    console.log(`server is running on port ${host}:${port}`);
})
