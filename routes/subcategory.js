const express = require('express');

const route = express.Router();

const SubCatController = require('../controller/subcategoryController.js')

route.get('/add_SubCaregory', SubCatController.addSubCategory);

route.post('/add_SubCatregoryData', SubCatController.addSubCategoryData)

route.get('/view_SubCaregory', SubCatController.viewSubCategory);

route.get('/active/:id', SubCatController.active);

route.get('/deactive/:id', SubCatController.deactive);

route.get('/delete/:id', SubCatController.delete);

route.get('/update/:id', SubCatController.update);

route.post('/UpdatedData', SubCatController.UpdatedData)


module.exports = route;


