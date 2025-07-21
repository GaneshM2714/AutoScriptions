const express = require('express')
const app = express();
const cors = require('cors');

const mongoose = require('mongoose')
const parse = require('body-parser')

const userroutes = require('./routes/userRoutes')
const subscriptionroutes  = require('./routes/subscriptionRoutes')

require("dotenv").config();
app.use(cors());

const corsOptions = {
    origin: true, 
    credentials: true
  };

//to parse the json in req.body
app.use(parse.json())
app.use('/users', userroutes);
app.use('/',subscriptionroutes);

app.use(cors(corsOptions));



async function connect(){
    try{
        await mongoose.connect(process.env.URI);
        console.log("Connection successfull");
    }
    catch(error){
        console.log(error);
    }
}

app.listen(process.env.PORT , () => {
    console.log("Listening on Port " + process.env.PORT);
    connect();
})