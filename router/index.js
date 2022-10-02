const express = require('express');
const router = express.Router();


console.log('Index Router');

router.use('/home', require('./home'));
router.use('/users', require('./user'));


module.exports = router;