const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/userController');


router.get('/profile/:id', userController.render_profile_page);


module.exports = router;