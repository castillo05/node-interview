const app = require('./app');
const mongoose= require('mongoose');
const dotenv= require('dotenv').config();
const port = process.env.PORT || 3000;


const {DB_USER, DB_PASSWORD, DB_URI}=process.env;



(async () => {

    try {
    

        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}${DB_URI}`,
         { useNewUrlParser: true,useUnifiedTopology: true  }).then(()=>{
            console.info(`Connected to database`);
            app.listen(port, function() {
                console.log('Aplicacion corriendo en el puerto' + port);
            });
         },error=>{
            console.error(`Connection error: ${error.stack}`);
            process.exit(1);
         })
        
        } catch (error) {
            console.log(error)
        }
    
})()