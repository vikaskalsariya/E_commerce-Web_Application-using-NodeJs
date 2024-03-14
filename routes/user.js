const express = require("express");
const routes = express.Router();
const userController = require("../controller/userController");
const passport = require("passport");

// Home page
routes.get("/", userController.dashboard);

// Register 
routes.get("/register", userController.register);
routes.post("/registerUser", userController.registerUser);

// Login
routes.post("/login", passport.authenticate('user',{failureRedirect : "/"}),userController.login);

// Product List
routes.get("/productList/:catId/:subCatId/:exCatId",passport.checkAuth, userController.productList);

// Price Filter
routes.post("/getPriceFilter", userController.getPriceFilter);

// Brand Filter
routes.post("/getBrandFilter", userController.getBrandFilter);

// Type Filter
routes.post("/getTypeFilter", userController.getTypeFilter);

// All Filter 
routes.post("/getAllFilterData", userController.getAllFilterData);

// Sigle Product Detail
routes.get("/singleProduct/:id", userController.singleProduct);

// Add to cart
routes.post("/addToCart",passport.checkAuth, userController.addToCart);

// View Cart
routes.get("/cart",passport.checkAuth, userController.viewCart);

// Update Quantity 
routes.post("/updateQuantity",passport.checkAuth, userController.updateQuantity);

// Delete Cart Item
routes.get("/deleteItem/:id",passport.checkAuth, userController.deleteItem);

// Payment checkout
routes.get("/checkout", passport.checkAuth, userController.checkout);

routes.post("/payment", passport.checkAuth, userController.payment);

// My Orders
routes.get("/orders", passport.checkAuth, userController.orders);

// Cancel Order
routes.get("/cancelOrder/:id",passport.checkAuth, userController.cancelOrder);


module.exports = routes;