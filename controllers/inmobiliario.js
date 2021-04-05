const mongoose = require('mongoose');
const inmobiliario= require('../models/inmobiliario');
const readFile=require('../utils/readFiles');
const dist=require('../utils/distancia')
const Json2csvParser = require("json2csv").Parser;
const jsoncsv = require('json-csv')
const fs = require("fs");
const dotenv= require('dotenv').config();
// Reports

const pdfMakePrinter = require("pdfmake/src/printer");
const DocDefinitionBuilder= require('../reports/doc-definition-builder');
const Title= require('../reports/title');
const eventsTable=require('../reports/events-table.content');

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
    const precioMin=parseInt(req.query.precioMin);
    const precioMax= parseInt(req.query.precioMax);
    const habitaciones=parseInt(req.query.habitaciones);

    

    try {
       
        if(!Number.isInteger(precioMin)   || !Number.isInteger(precioMax)  || !Number.isInteger(habitaciones) )
        return res.json({
            message:'Por Favor los campos del filtro deben ser numeros',
            data:'',
            error:true,
            code:456
        }) 

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

const promedioData= async (req, res)=>{
    try {
        const latitud=req.query.latitud;
        const longitud= req.query.longitud;
        const distancia=req.query.distancia;

        if(!latitud || !longitud || !distancia ===''){
            return res.json({
                message:'Por Favor usa todos los campos del filtro',
                data:'',
                error:true,
                code:456
            })
        }

        const data=await inmobiliario.find().exec();
        var dataArray= [];
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
          
            const distKM=await dist(latitud,longitud,element.Latitud,element.Longitud);
           
           
            if(distKM <= distancia){
             dataArray.push(element);        
            }
             
        }
      
            return res.json({
                 message:'Resultados encontrados',
                 data:dataArray,
                 error:false,
                 code:200
             })
      
    } catch (error) {
        console.log(error);
    }
}

const report= async (req,res)=>{
    try {

        const latitud=req.query.latitud;
        const longitud= req.query.longitud;
        const distancia=req.query.distancia;
        const tiporeporte=req.query.tiporeporte

        if(!latitud || !longitud || !distancia || !tiporeporte){
            return res.json({
                message:'Por Favor usa todos los campos del filtro',
                data:'',
                error:true,
                code:456
            })
        }

        
        const data= await inmobiliario.find().exec();

        var dataArray= [];
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
          
            const distKM=await dist(latitud,longitud,element.Latitud,element.Longitud);
           
           
            if(distKM <= distancia){
             dataArray.push(element);        
            }
             
        }

        if(tiporeporte==='PDF'){
            let ddBuilder = new DocDefinitionBuilder({});
        ddBuilder.addContent(new Title("Reporte de Inmobiliaria"));
        ddBuilder.addContent(new eventsTable('',dataArray,'','port_logs','arrival'));
       
        ddBuilder.pushStack();
        
    const fonts = {
        Courier: {
          normal: "Courier",
          bold: "Courier-Bold",
          italics: "Courier-Oblique",
          bolditalics: "Courier-BoldOblique",
        },
        Helvetica: {
          normal: "Helvetica",
          bold: "Helvetica-Bold",
          italics: "Helvetica-Oblique",
          bolditalics: "Helvetica-BoldOblique",
        },
        Times: {
          normal: "Times-Roman",
          bold: "Times-Bold",
          italics: "Times-Italic",
          bolditalics: "Times-BoldItalic",
        },
        Symbol: {
          normal: "Symbol",
        },
        ZapfDingbats: {
          normal: "ZapfDingbats",
        },
      };
  
      let printer = new pdfMakePrinter(fonts);
  
      const doc = printer.createPdfKitDocument(ddBuilder.output());
  
      const chunks = [];
  
      doc.on("data", function (chunk) {
        chunks.push(chunk);
      });
  
      doc.on("end", async function () {
        const result = Buffer.concat(chunks);
        const binary = "data:application/pdf;base64," + result.toString("base64");
        res.contentType("application/pdf");
        res.send(result);
      });
        doc.end();
    }else if(tiporeporte==='CSV'){

        var dataCsv=[];
        dataArray.forEach(async element => {
        var newInmobiliario= new inmobiliario(element)
            dataCsv.push(newInmobiliario);
        })
        
        // const json2csvParser= new Json2csvParser({header:true});
        // const csvData= json2csvParser.parse(dataCsv);
        const csvData= await jsoncsv.buffered(dataCsv);
        jsoncsv.buffered(dataArray, {
            fields : [
              {
                  name : 'Titulo',
                  label : 'Titulo',
                  quoted : true
              },
              {
                  name : 'Anunciante',
                  label : 'Anunciante'
              },
              {
                  name : 'Telefonos',
                  label : 'Telefonos'
              },
              {
                  name : 'Precio',
                  label : 'Precio'
              },
              {
                  name : 'Provincia',
                  label : 'Provincia'
              },
              {
                  name : 'Ciudad',
                  label : 'Ciudad'
              },
              {
                  name : 'Habitaciones',
                  label : 'Habitaciones'
              }
            ]},
            async(err, csv) => {
                if (err) return console.log(err);
                const hoy= new Date();
                var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
                var hora = hoy.getHours() + '-' + hoy.getMinutes() + '-' + hoy.getSeconds();
                var fechaYHora = fecha + '-' + hora;
                fs.writeFile('./files/'+fechaYHora+'_reporte.csv',csv,(error)=>{
                    if(error) return console.log(error);
        
                    console.log('Archivo csv creado');
                    var file = fs.readFileSync('./files/'+fechaYHora+'_reporte.csv', 'binary'); 
                    res.setHeader('Content-disposition', 'attachment; filename=' +fechaYHora+'_reporte.csv');
                    res.setHeader('Content-Length', file.length); 
                    res.write(file, 'binary'); 
                    res.end();
        
                })
            });
       
    }
        
    } catch (error) {
        console.log(error);
    }
}

const download = async (req,res)=>{
    try {
        var file = fs.readFileSync('./files/'+req.params.file, 'binary'); 
        res.setHeader('Content-disposition', 'attachment; filename=' + req.params.file);
        res.setHeader('Content-Length', file.length); 
        res.write(file, 'binary'); 
        res.end();

    } catch (error) {
        console.log(error);
    }
}


module.exports={
    test,
    saveData,
    filterData,
    promedioData,
    report,
    download
}