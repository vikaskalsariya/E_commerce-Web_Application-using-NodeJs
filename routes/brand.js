const express = require('express');

const route = express.Router();

const BrandController = require('../controller/brandController.js')

route.get('/add_Brand', BrandController.addBrand);

route.post('/add_BrandData', BrandController.addBrandData)

route.get('/view_brand', BrandController.viewBrand);

route.post('/getExtraCatData',BrandController.getExtraCatData);

route.get('/active/:id', BrandController.active);

route.get('/deactive/:id', BrandController.deactive);

route.get('/delete/:id', BrandController.delete);

route.get('/update/:id', BrandController.update);

route.post('/UpdatedData', BrandController.UpdatedData)


module.exports = route;


