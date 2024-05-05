var GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport = require('passport');

const Admin = require('../model/Admin')
passport.use(new GoogleStrategy(
    {
    clientID: "532242480043-ck8roe5lu9cmejb9b0sq7q64rhg34ubc.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8020/admin/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    // await Admin.find({ googleId: profile.id }, function (err, user) {
      // return cb(err, user);
    // });
  }
));
