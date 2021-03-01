const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv/config');

const runServer = require('./socketServer');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());


// Routes


// DB and Server Connection
mongoose.connect(process.env.DB_CONNECTION, 
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => {
        console.log('DB connected');
        runServer(app);
    });