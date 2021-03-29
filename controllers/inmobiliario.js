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

const filterData= async (req,res) => {
    const precioMin=req.query.precioMin;
    const precioMax= req.query.precioMax;
    const habitaciones=req.query.habitaciones;

  

    try {
        if(!precioMin  || !precioMax || !habitaciones === '')
        return res.json({
            message:'Por Favor usa todos los campos del filtro',
            data:'',
            error:true,
            code:456
        }) 
        const data = await inmobiliario.find(
            {
                Habitaciones:habitaciones,
                Precio: {
                    $gte:precioMin,
                    $lt: precioMax
                }
            }
            ).exec();
        res.json({
            message:'Resultados encontrados',
            data:data,
            error:false,
            code:200
        });
      
    } catch (error) {
        console.log(error);
    }
}


module.exports={
    test,
    saveData,
    filterData
}