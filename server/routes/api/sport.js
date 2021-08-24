const router = require('express').Router();
const auth = require('../../config/auth');
const user = require('../../database/user');
const sport = require('../../database/sport');
const team = require('../../database/team');
const helpers = require('../../helpers');

// array of middlewares for verifying admin
const verify_admin = [auth.required, user.attachUserData, user.isUserAdmin];
const validate_request = [...verify_admin, helpers.checkRequiredFields];

// route for listing all sports
router.get('/', sport.get);

// route for adding new sport
router.post('/add', ...validate_request, sport.checkUnique, sport.add);

// route for deleting existing sport
router.post('/remove', ...validate_request, sport.remove);

// route for listing all teams in choosen sport
router.get('/:sport_name/teams', team.getBySport);

// route for adding new team for choosen sport
router.post('/:sport_name/teams/add', ...validate_request, team.checkUnique, team.add);

// route for deleting existing team for choosen sport
router.post('/:sport_name/teams/remove', ...validate_request, team.remove);

module.exports = router;