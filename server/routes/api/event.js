const router = require('express').Router();
const auth = require('../../config/auth');
const user = require('../../database/user');
const event = require('../../database/event');
const helpers = require('../../helpers');

// array of middlewares for verifying admin
const verify_admin = [auth.required, user.attachUserData, user.isUserAdmin];
const validate_request = [...verify_admin, helpers.checkRequiredFields];

// route for listing all competitions
router.get('/', event.get);

// route for listing all competitions in selected sport
router.get('/:sport_name', event.getBySport);

// route for adding new competition
router.post('/add', ...validate_request, event.checkUnique, event.add);

// route for deleting existing competition
router.post('/remove', ...validate_request, event.remove);

// route for finishing all events
router.post('/finish-all', ...validate_request, event.finishAllEvents);

module.exports = router;