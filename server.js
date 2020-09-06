const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const connectDb = require('./config/db');
connectDb();

// cors
const corsOptions = {
    origin:process.env.ALLOWED_CLIENTS.split(',');

    // ['http://localhost:3000','http://localhost:3300','http://localhost:5000']
}

//template
app.set('views', path.join(__dirname,'/views'));
app.set('view engine','ejs');


// routes

app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'))

app.listen(PORT,()=>{
    console.log(`Listening On Port ${PORT}`);
})