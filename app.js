const express=require('express');
const readFile=require('./utils/readFiles')

const app= express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

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

module.exports =app;