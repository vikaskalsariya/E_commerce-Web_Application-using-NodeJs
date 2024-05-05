require("dotenv").config();
const express = require('express');

const mongoose = require('./config/db.js');

const app = express();

const path = require('path');


const port = process.env.PORT;

const cookieParser = require('cookie-parser');

var session = require('express-session');

const passport = require('passport');

const LocalStrategie = require('./config/passport-local-strategie.js');
const googleStrategie = require('./config/google-strategie.js');

app.use(cookieParser());

app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'assets')));
app.use(express.static(path.join(__dirname,'user_assets')));
app.use('/upload',express.static(path.join(__dirname,'upload')));


app.use(session({
    name : 'AdminData',
    secret: 'AdminData',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge : 1000*60*100,
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuth);


app.use('/',require('./routes/user.js'));
app.use('/admin',require('./routes/admin.js'));

app.listen(port, async(err)=>{
    if(err){
        console.log("Server is not run with port : "+port);
    }
    console.log("run sucessfully with port : "+port) ;
})