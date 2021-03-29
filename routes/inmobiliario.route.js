const express= require('express')
const inmobiliarioController = require('../controllers/inmobiliario')

const api = express.Router();

api.get('/test',inmobiliarioController.test);
api.get('/getdata',inmobiliarioController.saveData);
api.get('/getdata/filter',inmobiliarioController.filterData);

module.exports =api;