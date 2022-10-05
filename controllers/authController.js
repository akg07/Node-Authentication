const User = require('../model/user');
const UserAT = require('../model/userAccessToken');
const crypto = require('crypto');
const passwordMailer = require('../mailers/reset_pass_mailer');
const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;

module.exports.render_reset_pass_page = function(req, res) {
    // if(req.isAuthenticated()) {
    //     return res.redirect('/users/profile');
    // }

    return res.render('reset_password_page');
}

module.exports.render_login_page = function(req, res) {
    
    // if user is signed in don't show login page
    if(req.isAuthenticated()) {
        return res.redirect('/home');
    }
    
    return res.render('login');
}

module.exports.render_signup_page = function(req, res) {
    // if user is signed in don't show signup page
    if(req.isAuthenticated()) {
        return res.redirect('/home');
    }
    
    // console.log(req.cookies);
    // res.cookie('user_id', 25);

    return res.render('signUp');
}

// sign up new user
module.exports.create_new_user = async function(req, res) {

    console.log(req.body.email);
    try{
        if(req.body.password != req.body.confirm_password) {
            return res.redirect('back');
        }
        
        let user = await User.findOne({email: req.body.email});
        if(!user) {

            let newUser = new User();

            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.setPassword(req.body.password);

            newUser.save((err, User) => {
                
                if(err) {
                    console.log('error at saving new user ', err);
                    return res.redirect('back'); 
                }else {
                    req.flash('success', 'New User Created');
                    return res.redirect('/auth/login_page');
                }
            });
        }
        else {
            return res.redirect('back');
        }
    }catch(err){
        return res.redirect('back');

    }

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
    req.flash('success', 'Welcome ');

    return res.redirect('/home');
}

module.exports.distroy_session = function(req, res) {
    // logout function has been given to req by passport 
    req.logout(function(err) {
        if(err) {
            console.log(err || 'Logged out from session');
        }

        req.flash('success', 'See you soon');
        return res.redirect('/auth/login_page'); // redirect user to home
    }); 
}


module.exports.generate_access_token = async function(req, res) {
    try{
        let current_millies = new Date().getTime(); // current time in miliseconds
        current_millies = current_millies + (1000 * 60 * 5); // after 5 mins

        let user = await User.findOne({email: req.body.email});

        if(user) {
            // create a new accesstoken associated with this.user

            let userWithAT = await UserAT.create({
                user: user,
                expiresAt: Long.fromNumber(current_millies),
                accessToken: crypto.randomBytes(20).toString('hex')
            });

            userWithAT = await userWithAT.populate('user', 'name email');

            passwordMailer.resetPassword(userWithAT);

            return res.render('reset_pass_link_sent');
        }

    }catch(err) {
        console.log('AuthController: error at generating access token ', err);
    }
}

module.exports.verifyAccessToken = async function(req, res) {
    try{
        let current_millies = new Date().getTime();

        let userWithAT = await UserAT.findOne({accessToken: req.params.id});

        if(!userWithAT) {
            return res.render('invalid', {message: 'invalid link'});
        }

        if(userWithAT.expiresAt < current_millies) {
            await UserAT.findOneAndUpdate({accessToken: req.params.id}, {isValid: false});
            return res.render('invalid', {message: 'Timeout: Link Expired'});
        }

        if(!userWithAT.isValid) {
            return res.render('invalid', {message: 'Link Expired'});
        }

        let user_id = userWithAT.user;

        let user = await User.findById(user_id);

        if(user) {
            return res.render('update_password', {user: user, userWithAT: userWithAT});
        }

        return res.render('invalid', {message: 'Invalid user'});

    }catch(err) {
        console.log('AuthController: error at verifying access token ', err);
    }
}

module.exports.update_password = async function(req, res) {

    console.log('email', req.body.email);
    console.log('password', req.body.password);

    if(req.body.password == req.body.confirm_password) {

        // let user = await User.findOneAndUpdate({email: req.body.email},{password: req.body.password});
        let user = await User.findOne({email: req.body.email});
        user.setPassword(req.body.password);

        user.save((err, User) => {
            if(err){
                console.log('error at updaing password');
                return redirect('back');
            }
        });
        
        if(user) {
            if(req.body.isLogged == 1) await UserAT.findOneAndUpdate({accessToken: req.body.accessToken}, {isValid: false});
            req.flash('success', 'password updated');
            return res.redirect('/home');
        }
    }else {
        return;
    }
}

module.exports.render_password_page = function(req, res) {
    res.render('ask_password');
}

module.exports.verify_user = function(req, res) {
    

    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
            console.log('error at finding user in verify user: ', err);
            return;
        }

        if(user) {
            if(user.notMatch(req.body.password)) {
                req.flash('error', 'Wrong Password');
                return res.redirect('back');
            }else{
                req.flash('success', 'user verified');
                return res.render('update_password_logged', {user: user});
            }

        }else {
            req.flash('error', 'user not found');
            return res.redirect('back');
        }
    });
}