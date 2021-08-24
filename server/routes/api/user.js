const router = require('express').Router();
const auth = require('../../config/auth');
const helpers = require('../../helpers');
const user = require('../../database/user');

// signup route for adding new users
router.post('/signup', helpers.checkRequiredFields, user.handleSignUp);

// route for validating new users
router.get('/validate/:hash', user.validateUser);

// login route
router.post('/login', helpers.checkRequiredFields, user.validatePassword, user.isUserValidated, user.handleLogin);

// change personal data
router.post('/edit-profile', auth.required, user.changePersonalData);

// route for deposit
router.post('/deposit', auth.required, helpers.checkRequiredFields, user.deposit);

module.exports = router;