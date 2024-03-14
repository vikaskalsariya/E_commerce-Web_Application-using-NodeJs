const express = require("express");
const routes = express.Router();
const subCatController = require("../controller/subCatController");

// Add Sub Category
routes.get("/addSubCategory", subCatController.addSubCategory);
routes.post("/insertSubCategory", subCatController.insertSubCategory);

// View Sub Category
routes.get("/viewSubCategories", subCatController.viewSubCategories);

// Soft Delete
routes.get("/deactive/:id", subCatController.deactive);
routes.get("/active/:id", subCatController.active);

// Delete Sub Category
routes.get("/deleteData/:id" ,subCatController.deleteData);

// Update Sub Category
routes.get("/updateData/:id",subCatController.updateData);
routes.post("/editSubCategory",subCatController.editSubCategory);

// Get Sub Category Data
routes.post("/getSubCatData",subCatController.getSubCatData);

module.exports = routes;