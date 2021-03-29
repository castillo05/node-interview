const mongoose = require('mongoose');
const inmobiliario= require('../models/inmobiliario');
const readFile=require('../utils/readFiles');

const test= (req,res)=>{
    return res.json({message:'Hola desde controlador inmobiliarios'});
}

const saveData=async (req,res)=>{
  try {
    const data= await readFile('./files/resource.csv');

    data.forEach(async element => {
        console.log(element.Jardín);
        var newInmobiliario= new inmobiliario(element)
        

        const searchID= await inmobiliario.findOne({ID: element.ID}).exec();

        if(searchID){
            console.log('Este dato ya existe');
        }else{
            
            const newData= await newInmobiliario.save();

            newData ? console.log('Datos Insertados') : console.log('Error al insertar los datos')
        }

    });
    res.json(data)
  } catch (error) {
      console.log(error)
  }

}


module.exports={
    test,
    saveData
}