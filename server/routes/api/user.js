const router = require('express').Router();
const auth = require('../../config/auth');
const helpers = require('../../helpers');
const user = require('../../database/user');
const betslip = require('../../database/betslip');

// signup route for adding new users
router.post('/signup', helpers.checkRequiredFields, user.handleSignUp);

// route for validating new users
router.get('/validate/:hash', user.validateUser);

// login route
router.post('/login', helpers.checkRequiredFields, user.validatePassword, user.isUserValidated, user.handleLogin);

// get current user data
router.post('/current', auth.required, user.attachUserData, user.handleLogin);

// change personal data
router.post('/edit-profile', auth.required, user.changePersonalData);

// route for deposit
router.post('/deposit', auth.required, helpers.checkRequiredFields, user.deposit);

// route for placing bet
router.post('/place-bet', auth.required, helpers.checkRequiredFields, helpers.validateBet, user.placeBet, user.attachUserData, user.takeMoneyFromUser);

// route for getting betslips
router.post('/bets', auth.required, user.getBets);

// route for cashout single betslip
router.post('/cashout', auth.required, helpers.checkRequiredFields, betslip.isCashoutAvailable, betslip.cashout);

module.exports = router;