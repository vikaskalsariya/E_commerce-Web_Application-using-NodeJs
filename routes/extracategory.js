const express = require('express');

const route = express.Router();

const ExtraCatController = require('../controller/extracategoryController.js')

route.get('/add_ExtraCaregory', ExtraCatController.addExtraCategory);

route.post('/add_ExtraCatregoryData', ExtraCatController.addExtraCategoryData)

route.get('/view_ExtraCaregory', ExtraCatController.viewExtraCategory);

route.post('/getSubCatData',ExtraCatController.getSubCatData);

route.post('/getBrandType',ExtraCatController.getBrandType);

route.get('/active/:id', ExtraCatController.active);

route.get('/deactive/:id', ExtraCatController.deactive);

route.get('/delete/:id', ExtraCatController.delete);

route.get('/update/:id', ExtraCatController.update);

route.post('/UpdatedData', ExtraCatController.UpdatedData)


module.exports = route;


