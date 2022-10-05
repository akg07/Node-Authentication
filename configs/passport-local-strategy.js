//  This startegy is written by Aayush Kumar Gupta

// passport-local authentication , User Input authentication

const passport = require('passport'); // get instance of passport
const LocalStrategy = require('passport-local').Strategy; // local-auth startegy
const User = require('../model/user'); // User schema


// Authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, function(req, email, password, done) {

        // find the user and establish connection
        User.findOne({email: email}, function(err, user) {
            if(err) {
                req.flash('error', 'Internal Server Error')
                return done(err);
            }

            if(!user || user.notMatch(password)) {
                req.flash('error', 'Invalid user / password')
                return done(null, false); // there is no error but user is not found -> false
            }

            return done(null, user); // there is no error but user is found
        });
    }
));

// serialize user function 
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserialize the user
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err) {
            console.log('Error : Passport config : finding user');
            return done(err);
        }

        return done(null, user);
    });
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next) {
    // next function(controller action)
    if(req.isAuthenticated()) {
        return next();
    }

    // is user is not signed in
    return res.redirect('/auth/login_page');
}

// If there is a user logged In : Set this user as local user
passport.setAuthenticatedUser = function(req, res, next) {
    if(req.isAuthenticated()) {
        // req.user contains current signed user from the sessio cookie
        res.locals.user = req.user;
    }

    next(); // call Next middleware : Most Imp
}


// export this startegy
module.exports = passport;