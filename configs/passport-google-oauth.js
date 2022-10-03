const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../model/user');

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

            console.log(profile);

            if(user) {
                return done(null, user);
            }else {
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

module.exports = passport;


