const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv/config');

const userRoute = require('./routes/users');
const runServer = require('./socket/socketServer');

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/user', userRoute);

// DB and Server Connection
mongoose.connect(process.env.DB_CONNECTION, 
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => {
        console.log('DB connected');
        runServer(app);
    });