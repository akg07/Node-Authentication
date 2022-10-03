const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');


// Authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
    }, function(email, password, done) {
        // find the user and establish connection
        User.findOne({email: email}, function(err, user) {
            if(err) {
                console.log('Error : Passport config ');
                return done(err);
            }

            if(!user || user.password != password) {
                console.log('Invalid user / password');
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

passport.setAuthenticatedUser = function(req, res, next) {
    if(req.isAuthenticated()) {
        // req.user contains current signed user from the sessio cookie
        res.locals.user = req.user;
    }

    next();
}



module.exports = passport;