const router = require('express').Router();
const auth = require('../../config/auth');
const user = require('../../database/user');
const competition = require('../../database/competition');
const helpers = require('../../helpers');

// array of middlewares for verifying admin
const verify_admin = [auth.required, user.attachUserData, user.isUserAdmin];
const validate_request = [...verify_admin, helpers.checkRequiredFields];

// route for listing all competitions
router.get('/', competition.get);

// route for listing all competitions in selected sport
router.get('/:sport_name', competition.getBySport);

// route for adding new competition
router.post('/add', ...validate_request, competition.checkUnique, competition.add);

// route for deleting existing competition
router.post('/remove', ...validate_request, competition.remove);

module.exports = router;