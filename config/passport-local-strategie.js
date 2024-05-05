const passport = require('passport');

const localStrategie = require('passport-local').Strategy;

const admin = require('../model/Admin.js');
const user = require('../model/User.js');


passport.use('admin',new localStrategie({
    usernameField: "email",
}, async (email, password, done) => {
    let AdminData = await admin.findOne({ email: email });
    if (AdminData) {
        if (password == AdminData.password) {
            return done(null, AdminData);
        }
        else {
            return done(null, false);
        }
    }
    else {
        return done(null, false);
    }
}));


passport.use('user', new localStrategie({
    usernameField: "email",
}, async (email, password, done) => {
    let UserData = await user.findOne({ email: email });
    if (UserData) {
        if (password == UserData.password) {
            return done(null, UserData);
        }
        else {
            return done(null, false);
        }
    }
    else {
        return done(null, false);
    }
}));


passport.serializeUser(async (user, done) => {
    return done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        let AdminData = await admin.findById(id);
        let UserData = await user.findById(id);
        if(AdminData)
        {
            if (AdminData.role == 'admin') {
                return done(null, AdminData);
            }
        }
        else if(UserData.role =='user'){
            return done(null,UserData);
        }
        else{
            return done(null,false);
        }
    }
    catch (err) {
        console.log(err);
        return done(null, false);
    }
})

passport.setAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.role == 'admin') {
            res.locals.user = req.user;
        }
        else if(req.user.role == 'user'){
            res.locals.userDetails = req.user;
        }
    }
     next();
}

passport.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.role == 'admin') {
            return next();
        }
        else if (req.user.role == 'user') {
            return res.redirect('/');
        }
    }
    else {
        return res.redirect('/');
    }
}
module.exports = passport;