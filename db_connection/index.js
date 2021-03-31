const mongoose = require('mongoose');
const dotenv= require('dotenv');

dotenv.config();


const {DB_USER, DB_PASSWORD, DB_URI}=process.env;

const database=mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}${DB_URI}`,{
    
    useNewUrlParser: true,
    dbName:'test-csv',
    useUnifiedTopology: true,
    useFindAndModify: false
    
});

module.exports=database;