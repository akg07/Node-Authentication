const express = require('express');
const router = express.Router();
const passport = require('passport');

const authController = require('../controllers/authController');

// use passport as a middleware to authenticate
router.post('/create_session', passport.authenticate(
    'local',
    {failureRedirect: '/auth/login_page'}
), authController.create_session_passport_Auth);

router.get('/login_page', authController.render_login_page);
router.get('/signup_page', authController.render_signup_page);
router.post('/create_new', authController.create_new_user);
router.get('/sign-out', authController.distroy_session);
// router.post('/create_session', userController.create_session_mannual_Auth);

router.get('/reset_pass_page', authController.render_reset_pass_page);
router.post('/generate_accessToken', authController.generate_access_token);
router.get('/verify_key/:id', authController.verifyAccessToken);
router.post('/update_password', authController.update_password);

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/auth/login_page'}), authController.create_session_passport_Auth)

module.exports = router;