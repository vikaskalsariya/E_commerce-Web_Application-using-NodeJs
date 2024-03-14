const express = require("express");
const routes = express.Router();
const exCatController = require("../controller/exCatController");

// Add Ex Category
routes.get("/addExCategory", exCatController.addExCategory);
routes.post("/insertExCategory", exCatController.insertExCategory);

// View Extra Category
routes.get("/viewExCategories", exCatController.viewExCategories);

// Soft Delete
routes.get("/deactive/:id", exCatController.deactive);
routes.get("/active/:id", exCatController.active);

// Delete Extra Category
routes.get("/deleteData/:id" ,exCatController.deleteData);

// Update Sub Category
routes.get("/updateData/:id",exCatController.updateData);
routes.post("/editExCategory",exCatController.editExCategory);

// Get Extra Category Data
routes.post("/getExCatData",exCatController.getExCatData);

module.exports = routes;