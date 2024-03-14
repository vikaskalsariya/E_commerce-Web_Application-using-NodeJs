const passport = require("passport");

const localStratagy = require("passport-local").Strategy;

const Admin = require("../model/Admin");
const User = require("../model/User");

passport.use(new localStratagy({
    usernameField : "email"
},async function (email,password,done){
    
    let adminData = await Admin.findOne({email : email});
    if(adminData){
        if(adminData.password == password){
            return done(null,adminData);
        }
        else{
            return done(null,false);
        }
    }
    else{
        return done(null,false);
    }

}))

passport.use('user',new localStratagy({
    usernameField : "email"
},async function (email,password,done){
    
    let userData = await User.findOne({email : email});
    if(userData){
        if(userData.password == password){
            return done(null,userData);
        }
        else{
            return done(null,false);
        }
    }
    else{
        return done(null,false);
    }

}))

passport.serializeUser(async (user,done) => {
    return done(null,user.id);
})

passport.deserializeUser(async (id,done) => {
    let adminData = await Admin.findById(id);
    let userData = await User.findById(id);
    if(adminData){
        return done(null,adminData);
    }
    else if(userData.role == "user"){
        return done(null,userData);
    }
    else{
        return done(null,false);
    }
})

passport.setAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        // To store data in session
        if(req.user.role == "admin"){
            res.locals.user = req.user;
        }
        else if(req.user.role == "user"){
            res.locals.userData = req.user;
        }
    }
    next();
}

passport.checkAuth = (req,res,next) => {
    if(req.isAuthenticated()){
        if(req.user.role == "admin"){
            return next();
        }
        else if(req.user.role == "user"){
            return next();
        }
    }
    else{
        console.log("Please login")
        return res.redirect("/");
    }
}

module.exports = passport;