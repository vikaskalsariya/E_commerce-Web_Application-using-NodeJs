const express = require("express");
const routes = express.Router();
const categoryController = require("../controller/categoryController");

// Add Category
routes.get("/addCategory",categoryController.addCategory);
routes.post("/insertCategory",categoryController.insertCategory);

// View Category
routes.get("/viewCategories",categoryController.viewCategories);

// Soft delete
routes.get("/deactive/:id", categoryController.deactive);
routes.get("/active/:id", categoryController.active);

// Delete Category
routes.get("/deleteData/:id" ,categoryController.deleteData);

// Update Category
routes.get("/updateData/:id",categoryController.updateData);
routes.post("/editCategory",categoryController.editCategory);

module.exports = routes;