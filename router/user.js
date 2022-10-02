const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/login_page', userController.render_login_page);
router.get('/signup_page', userController.render_signup_page);

module.exports = router;