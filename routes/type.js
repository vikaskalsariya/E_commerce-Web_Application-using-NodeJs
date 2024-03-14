const express = require("express");
const routes = express.Router();
const typeController = require("../controller/typeController");

// Add Type
routes.get("/addType", typeController.addType);
routes.post("/insertType", typeController.insertType);

// View Types
routes.get("/viewTypes", typeController.viewTypes);

// Soft Delete
routes.get("/deactive/:id", typeController.deactive);
routes.get("/active/:id", typeController.active);

// Delete Type
routes.get("/deleteData/:id" ,typeController.deleteData);

// Update Type
routes.get("/updateData/:id",typeController.updateData);
routes.post("/editType",typeController.editType);


module.exports = routes;