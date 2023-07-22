//import required packages
const express = require('express');
const passport = require("passport");
const router = express.Router();
const homeController = require('../controllers/home_Controller');

router.get('/', passport.checkAuthentication, homeController.home);
router.use('/users', require('./users'));
module.exports = router;