const express = require('express');
const route = express.Router();
const passport = require('passport');

const UserController = require('../controller/userController.js');

route.get('/',UserController.home);

route.get('/Productlist/:Cid/:Sid/:Eid',UserController.Productlist)

route.post('/setrangeData',UserController.setrangeData)

route.get('/singleProduct/:id',UserController.singleProduct)

route.post('/getBrandData',UserController.getBrandData)

// user Register 
route.get('/userRegister',UserController.userRegister);
route.post('/register',UserController.register)

// user Login 
route.get('/userLogin',UserController.userLogin);
route.post('/Login',passport.authenticate('user',{failureRedirect:'/'}),UserController.Login);

// buccate count 
route.post('/addToCartCount',UserController.addToCartCount)

// Add To Cart Box
route.get('/AddToCartBox',UserController.AddToCartBox);
route.get('/showMyCart',UserController.showMyCart);

// change total Price  
route.post('/CartQuentity',UserController.CartQuentity)

// check Out add to cart 
route.get('/chekOut',UserController.chekOut)
route.post('/payment',UserController.payment);
module.exports = route;