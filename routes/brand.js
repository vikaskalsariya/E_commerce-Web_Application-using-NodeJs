const express = require("express");
const routes = express.Router();
const brandController = require("../controller/brandController");

// Add Brand
routes.get("/addBrand", brandController.addBrand);
routes.post("/insertBrand", brandController.insertBrand);

// View Brands
routes.get("/viewBrands", brandController.viewBrands);

// Soft Delete
routes.get("/deactive/:id", brandController.deactive);
routes.get("/active/:id", brandController.active);

// Delete Brand
routes.get("/deleteData/:id" ,brandController.deleteData);

// Update Sub Category
routes.get("/updateData/:id",brandController.updateData);
routes.post("/editBrand",brandController.editBrand);

// Get Brand And Type Data
routes.post("/getBrandAndType", brandController.getBrandAndType);

module.exports = routes;