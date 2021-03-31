const app = require('./app');
const mongoose= require('mongoose');
const dotenv= require('dotenv').config();
const port = process.env.PORT || 3000;
const database=require('./db_connection')


const {DB_USER, DB_PASSWORD, DB_URI}=process.env;



(async () => {

    try {
        
        const connect=await database;

        if(connect){
            app.listen(port, function() {
                console.log('Database Connect')
                console.log('Aplicacion corriendo en el puerto' + port);
            });
        }
           
      
        
        } catch (error) {
            console.log(error)
        }
    
})()