module.exports.render_login_page = function(req, res) {

    return res.render('login', {
        title: "login Page"
    });
}

module.exports.render_signup_page = function(req, res) {

    return res.render('signUp', {
        title: "Signup Page"
    });
}