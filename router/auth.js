const express = require('express');
const router = express.Router();
const passport = require('passport');

const authController = require('../controllers/authController');

// use passport as a middleware to authenticate
router.post('/create_session', passport.authenticate(
    'local',
    {failureRedirect: '/users/login_page'}
), authController.create_session_passport_Auth);

router.get('/login_page', authController.render_login_page);
router.get('/signup_page', authController.render_signup_page);
router.post('/create_new', authController.create_new_user);
router.get('/sign-out', authController.distroy_session);
// router.post('/create_session', userController.create_session_mannual_Auth);

module.exports = router;