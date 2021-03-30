const express= require('express')
const inmobiliarioController = require('../controllers/inmobiliario')

const api = express.Router();

api.get('/test',inmobiliarioController.test);
api.get('/getdata',inmobiliarioController.saveData);
api.get('/getdata/filter',inmobiliarioController.filterData);
api.get('/getdata/distancia',inmobiliarioController.promedioData);
api.get('/getdata/report',inmobiliarioController.report);

module.exports =api;