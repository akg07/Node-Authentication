//  This startegy is written by Aayush Kumar Gupta


// Passport is used for google Authentication

// get instance of passport
const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy; // google strategy
const crypto = require('crypto'); // create a random password using crypto
const User = require('../model/user'); // User schema

// use google strategy for signing
passport.use(new googleStrategy({
        clientID: "97206409428-fj5m6sh8bb1na4ikji27eblrarqfsjg9.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8080/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err) {
                console.log('err : passport google auth config ', err);
                return;
            }

            if(user) {
                // if user is present in DB then logIn Directly
                return done(null, user);
            }else {
                // In Case of User is not present in DB: Register this user in DB and Login
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user) {
                    if(err) {
                        console.log('err : passport google auth config ', err);
                        return;
                    }

                    return done(null, user);
                });
            }
        });
    }
));

// Export this strategy
module.exports = passport;