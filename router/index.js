const express = require('express');
const router = express.Router();
const passport = require('passport');


console.log('Index Router');

router.use('/home', passport.checkAuthentication, require('./home'));
router.use('/users', passport.checkAuthentication, require('./user'));
router.use('/auth', require('./auth'));


module.exports = router;