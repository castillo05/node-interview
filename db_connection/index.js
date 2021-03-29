const mongoose = require('mongoose');
const dotenv= require('dotenv');

doyenv.config();


const {DB_USER, DB_PASSWORD, DB_URI}=process.env;

const database=mongoose.createConnection(`mongodb+srv://${DB_USER}:${DB_PASSWORD}${DB_URI}`,{
    
    useNewUrlParser: true,
    dbName:'test-csv',
    useUnifiedTopology: true,
    useFindAndModify: false
    
});

module.exports=database;