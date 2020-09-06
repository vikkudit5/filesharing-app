require('dotenv').config();
const mongoose  = require('mongoose');

const MONGO_CONNECTION_URL = "mongodb+srv://filesharing:Vikash@123@cluster0.vfp9a.mongodb.net/filesharing?retryWrites=true&w=majority";

// const APP_BASE_URL = "http://localhost:3000/";


function connectDb(){
    // Database Connection
    mongoose.connect(MONGO_CONNECTION_URL,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useUnifiedTopology:true,
        useFindAndModify:true
    });

    const connection = mongoose.connection;

    connection.once('open',()=>{
        console.log('Database Connected.')
    }).catch(err=>{
        console.log('connection Failed.')
    })
}

module.exports = connectDb;