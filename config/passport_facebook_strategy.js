// import all required packages
const passport = require("passport");
const crypto = require("crypto");
const User = require("../models/user");
const FacebookStrategy = require('passport-facebook').Strategy;

//tell passport to use new strategy for google login
passport.use(
    new FacebookStrategy(
      {
        clientID:
          "YOUR_CLIENTID",
        clientSecret: "YOUR_SECRETID",
        callbackURL: process.env.CALLBACK,
      },
      //find a user
      async function (accessToken, refreshToken, profile, done) {
        let user = await User.findOne({ email: profile.emails[0].value });
        try {
          console.log(profile);
          if (user) {
            //if found set this user as req.user
            return done(null, user);
          } else {
            //if not found create the user and set it as req.user
            let u = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            });
            return done(null, u);
          }
        } catch (err) {
          console.log("Error in the passport-facebook-strategy " + err);
          return;
        }
      }
    )
  );
  
  module.exports = passport;
  
