const User = require('../model/user');

module.exports.render_login_page = function(req, res) {
    
    // if user is signed in don't show login page
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    
    return res.render('login');
}

module.exports.render_signup_page = function(req, res) {
    // if user is signed in don't show signup page
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    
    // console.log(req.cookies);
    // res.cookie('user_id', 25);

    return res.render('signUp');
}

// sign up new user
module.exports.create_new_user = function(req, res) {

    console.log(req.body.email);

    if(req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
            console.log('error at finding user: ', err);
            return;
        }

        if(!user) {
            User.create(req.body, function(err, user) {
                if(err) {
                    console.log('error at finding user: ', err);
                    return;
                }

                return res.redirect('/auth/login_page');
            });
        }
        else {
            return res.redirect('back');
        }
    });
}

/* 
    MANUAL AUTHENTICATION

    sign in user - create a session for user

    find the user
    handle user found
    handle mismatching password 
    handle session creation
    handle user is not found 
*/
module.exports.create_session_mannual_Auth = function(req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
            console.log('error at finding user in  sign in: ', err);
            return;
        }

        if(user) {
            if(user.password != req.body.password) {
                console.log('Invalid user / password')
                return res.redirect('back');
            }

            res.cookie('user_id', user.id);

            return res.redirect('/users/profile');
        }else {
            console.log('user not found');
            return res.redirect('back');
        }
    });
}

module.exports.create_session_passport_Auth = function(req, res) {
    return res.redirect('/users/profile');
}

module.exports.distroy_session = function(req, res) {
    // logout function has been given to req by passport 
    req.logout(function(err) {
        if(err) {
            console.log(err || 'Logged out from session');
        }
        // req.flash('success', 'See you soon :-)');
        return res.redirect('/home'); // redirect user to home
    }); 
}