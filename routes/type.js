const express = require('express');

const route = express.Router();

const BrandController = require('../controller/brandController.js')
const TypeController = require('../controller/typeController.js')

route.get('/add_type', TypeController.addType);

route.post('/add_TypeData', TypeController.addTypeData)

route.get('/view_type', TypeController.viewType);

route.post('/getExtraCatData',BrandController.getExtraCatData);

route.get('/active/:id', TypeController.active);

route.get('/deactive/:id', TypeController.deactive);

route.get('/delete/:id', TypeController.delete);

route.get('/update/:id', TypeController.update);

route.post('/UpdatedData', TypeController.UpdatedData)


module.exports = route;


