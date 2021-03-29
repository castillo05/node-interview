const express=require('express');
const readFile=require('./utils/readFiles')

// Rutas
const inmobiliarioRoute=require('./routes/inmobiliario.route');

const app= express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//configurar cabeceras http
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY,Origin,X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

app.get('/api',(req,res)=>{
    res.json({
        message:'Hola Mundo',
        error:false,
        code:200
    })
})

app.get('/readfile',async(req,res)=>{
    const data= await readFile('./files/resource.csv');

    res.json(data)
   
})

app.use('/api',inmobiliarioRoute);

module.exports =app;