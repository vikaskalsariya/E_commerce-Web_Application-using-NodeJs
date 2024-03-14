const express = require("express");
const routes = express.Router();
const Product = require("../model/Product");
const productController = require("../controller/productController");

// Add Product
routes.get("/addProduct", productController.addProduct);
routes.post("/insertProduct", Product.uploadProductImage ,productController.insertProduct)

// View Product Data
routes.get("/viewProducts", productController.viewProducts);

// Soft Delete
routes.get("/deactive/:id", productController.deactive);
routes.get("/active/:id", productController.active);

// Delete Product
routes.get("/deleteData/:id" ,productController.deleteData);

// Update Product
routes.get("/updateData/:id",productController.updateData);
routes.post("/editProduct",Product.uploadProductImage,productController.editProduct);

// Delete Multi Images
routes.post("/deleteMultiImages",productController.deleteMultiImages)

module.exports = routes;