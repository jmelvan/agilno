const router = require('express').Router();
const auth = require('../../config/auth');
const { error } = require('../../config');
const user = require('../../database/user');

// function to check required fields for login and registration
const checkRequiredFields = (req, res, next) => {
  if(!req.body || !req.body.email || !req.body.password) 
    return res.status(422).json({ error: error.fields });
  next();
}

// function to handle sign up request (check if user exist, if not, create use)
const handleSignUp = (req, res) => {
  //request database to see if email exists
  user.getUser(req.body.email).then(result => {
    // if user with given email is found, return error to client that email is already in use
    res.status(422).json({error: error.email_exists});
  }).catch((e) => {
    // cahtches reject error if no rows found in database (meaning that user with that email doesn't exist, so we can create new one)
    e && user.createUser(req.body.email, req.body.password).then(() => res.sendStatus(201));
  });
}

// function to handle login request (return jwt token)
const handleLogin = (req, res) => res.json({ token: user.signJWT(req.user) });

// signup route for adding new users
router.post('/signup', checkRequiredFields, handleSignUp);

// route for validating new users
router.get('/validate/:hash', user.validateUser);

// login route
router.post('/login', checkRequiredFields, user.validatePassword, user.isUserValidated, handleLogin);

// change personal data
router.post('/edit-profile', auth.required, user.changePersonalData);

// route for deposit
router.post('/deposit', auth.required, user.deposit);

module.exports = router;