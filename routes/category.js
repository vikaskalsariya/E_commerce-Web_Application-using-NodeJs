const express = require('express');

const route = express.Router();

const CantegoryController = require('../controller/categoryController.js')

route.get('/add_category', CantegoryController.addCategory);

route.post('/add_categoryData', CantegoryController.addCategoryData)

route.get('/view_category', CantegoryController.viewCategory);

route.get('/active/:id', CantegoryController.active);

route.get('/deactive/:id', CantegoryController.deactive);

route.get('/delete/:id', CantegoryController.delete);

route.get('/update/:id', CantegoryController.update);

route.post('/UpdatedData', CantegoryController.UpdatedData)


module.exports = route;


