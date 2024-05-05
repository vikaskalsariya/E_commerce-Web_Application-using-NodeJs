const express = require('express');

const route = express.Router();

const adminController = require('../controller/adminController.js')

const passport = require('passport');

const Category = require('../model/Category.js');


// -----------------dashboard ------------------
route.get('/', async (req, res) => {
    return res.render('admin/login')
});

// ----------------- Admin login ------------------
route.post('/login', passport.authenticate('admin', { failureRedirect: '/admin' }), adminController.Login);

// ---------Forgot Admin Pssword ------------
route.get('/forgotPass', async (req, res) => {
    return res.render('admin/forgotPass');
})

route.post('/fpSendOTP', adminController.fpSendOTP)

route.post('/checkOTP', adminController.checkOTP)

route.post('/forgotPassword', adminController.forgotPassword)

//--------------- passport chek aothoride after pages ------------
route.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));

route.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        console.log(req.body)
        // res.redirect('/');
    });

route.use('/', passport.checkAuth, require('./adminPermition.js'));


module.exports = route;