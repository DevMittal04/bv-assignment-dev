// Loads .env
require('dotenv').config()

// Imports
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/users')
const Feeds = require('./models/feeds')

// App configs
const app = express();
const port = 3000;
app.use(express.json())

// DB Setup
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to Database"))

// User Router
const userRouter = require('./routes/users')
app.use('/users', userRouter)

// Feed Router
const feedRouter = require('./routes/feeds')
app.use('/feeds', feedRouter)

// Server Listen
app.listen(port, () => {
    console.log("Listening on port", port);
})