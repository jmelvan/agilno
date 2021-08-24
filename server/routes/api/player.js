const router = require('express').Router();
const auth = require('../../config/auth');
const user = require('../../database/user');
const player = require('../../database/player');
const helpers = require('../../helpers');

// array of middlewares for verifying admin
const verify_admin = [auth.required, user.attachUserData, user.isUserAdmin];
const validate_request = [...verify_admin, helpers.checkRequiredFields];

// route for listing all players
router.get('/', player.get);

// route for listing all players playing selected sport
router.get('/:sport_name', player.getBySport);

// route for adding new player
router.post('/add', ...validate_request, player.checkUnique, player.add);

// route for deleting existing player
router.post('/remove', ...validate_request, player.remove);

// route for asigning existing player to existing club
router.post('/asign-to-team', ...validate_request, player.asignToTeam);

module.exports = router;