const express = require('express');

const route = express.Router();

const Product = require('../model/Product.js');
const BrandController = require('../controller/brandController.js')
const ProductController = require('../controller/productController.js')

route.get('/add_product', ProductController.addProdcut);

route.post('/add_ProductData' ,Product.ProductImg, ProductController.addProductData)

route.get('/view_product', ProductController.viewProduct);

route.get('/active/:id', ProductController.active);

route.get('/deactive/:id', ProductController.deactive);

route.get('/delete/:id', ProductController.delete);

route.get('/update/:id', ProductController.update);

route.post('/UpdatedData',Product.ProductImg ,ProductController.UpdatedData)

route.post('/removeOneImg',ProductController.removeOneImg)

module.exports = route;


