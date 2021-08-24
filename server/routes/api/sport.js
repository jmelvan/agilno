const router = require('express').Router();
const auth = require('../../config/auth');
const user = require('../../database/user');
const sport = require('../../database/sport');
const club = require('../../database/club');

// array of middlewares for verifying admin
const verify_admin = [auth.required, user.attachUserData, user.isUserAdmin];

// route for listing all sports
router.get('/', ...verify_admin, sport.get);

// route for adding new sport
router.post('/add', ...verify_admin, sport.checkUnique, sport.add);

// route for deleting existing sport
router.post('/remove', ...verify_admin, sport.remove);

// route for listing all clubs
router.get('/:sport_name/clubs', ...verify_admin, club.get);

module.exports = router;