const express = require('express');

let Admin = require("../model/Admin.js");

const route = express.Router();

const adminController = require('../controller/adminController.js')

// ----------------- Admin ------------------

route.get('/dashboard', adminController.dashboard);

route.get('/add_admin', adminController.addAdmin);

route.post('/add_adminData', Admin.AdminImg, adminController.addAdminData)

route.get('/view_admin', adminController.viewAdmin);

route.get('/active/:id', adminController.active);

route.get('/deactive/:id', adminController.deactive);

route.get('/delete/:id', adminController.delete);

route.get('/update/:id', adminController.update);

route.post('/UpdatedData', Admin.AdminImg, adminController.UpdatedData)

route.get('/logout', async (req, res) => {
    try {
        res.clearCookie('AdminData');
        return res.redirect('/admin');

    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
})

route.get('/profile',adminController.profile)

route.post('/updateProfile',Admin.AdminImg,adminController.updateProfile)

route.post('/changePassword',adminController.changePassword)


// ------------------ Category ------------------

route.use('/category',require('./category.js'));

// ------------------ Subcategory ------------------

route.use('/SubCaregory',require('./subcategory.js'));

// ------------------ Extracategory ------------------

route.use('/ExtraCaregory',require('./extracategory.js'));

// ------------------ Brand ------------------

route.use('/Brand',require('./brand.js'));

// ------------------ Type ------------------

route.use('/Type',require('./type.js'));

// ------------------ Product ------------------

route.use('/Product',require('./product.js'));


module.exports = route;