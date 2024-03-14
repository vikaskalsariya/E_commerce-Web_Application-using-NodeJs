const express = require("express");
const routes = express.Router();
const adminController = require("../controller/adminController");
const Admin = require("../model/Admin");
const passport = require("passport");

// Login
routes.get("/", async (req,res) => {
    return res.render("login");
})
routes.post("/login", passport.authenticate('local',{failureRedirect : "/admin"}) ,adminController.login);

// Logout
routes.get("/logout", adminController.logout);

// Dashboard
routes.get("/dashboard", passport.checkAuth ,adminController.dashboard);

// Add Admin
routes.get("/addAdmin",passport.checkAuth ,adminController.addAdmin);
routes.post("/insertAdmin",passport.checkAuth ,Admin.uploadAdminImage,adminController.insertAdmin)

// View Admin
routes.get("/viewAdminData",passport.checkAuth ,adminController.viewAdminData);

// Soft delete
routes.get("/deactive/:id", adminController.deactive);
routes.get("/active/:id", adminController.active);

// Delete Admin
routes.get("/deleteData/:id", passport.checkAuth ,adminController.deleteData);

// Change Password
routes.post("/editPassword", adminController.editPassword);

// Profile
routes.get("/profile",passport.checkAuth , adminController.profile);

// Update Profile
routes.post("/updateProfile",Admin.uploadAdminImage,adminController.updateProfile);

// Update Admin
routes.get("/updateData/:id",adminController.updateData);
routes.post("/editAdminData",Admin.uploadAdminImage,adminController.editAdminData);


//---------- Forget password -------------//

routes.get("/emailPage", async (req,res) => {
    return res.render("ForgotPass/emailPage");
});

// check email
routes.post("/checkEmail", adminController.checkEmail);

// send OTP
routes.get("/otpPage", async (req,res) => {
    return res.render("ForgotPass/otpPage")
})

// check OTP
routes.post("/checkOTP", adminController.checkOTP);

// Change password
routes.get("/changeForgetPass",adminController.changeForgetPass);
routes.post("/editForgetPass",adminController.editForgetPass);


// ---------   Other Routings   ----------  //

// Categories
routes.use("/category",passport.checkAuth ,require("./category"));

// Sub Categories
routes.use("/subCategory",passport.checkAuth ,require("./subCategory"));

// Extra Categories
routes.use("/extraCategory",passport.checkAuth ,require("./extraCategory"));

// Brand
routes.use("/brand",passport.checkAuth ,require("./brand"));

// Type
routes.use("/type",passport.checkAuth ,require("./type"));

// Product
routes.use("/product",passport.checkAuth ,require("./product"));

module.exports = routes;