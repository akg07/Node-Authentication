module.exports.render_login_page = function(req, res) {

    return res.render('login', {
        title: "login Page"
    });
}