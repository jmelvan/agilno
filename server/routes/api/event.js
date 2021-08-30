const router = require('express').Router();
const auth = require('../../config/auth');
const user = require('../../database/user');
const event = require('../../database/event');
const quota = require('../../database/quota');
const betslip = require('../../database/betslip');
const helpers = require('../../helpers');

// array of middlewares for verifying admin
const verify_admin = [auth.required, user.attachUserData, user.isUserAdmin];
const validate_request = [...verify_admin, helpers.checkRequiredFields];

// route for listing all unfinished events
router.get('/', event.get);

// route for listing all unfinished events
router.get('/get-all', event.getAll);

// route for listing all unfinished events in selected sport
router.get('/in/:sport_name', event.getBySport);

// route for adding new event
router.post('/add', ...validate_request, event.checkUnique, event.add);

// route for deleting existing event
router.post('/remove', ...validate_request, event.remove);

// route for finishing only one unfinished events
router.post('/finish', ...validate_request, event.finishOneEvent, betslip.processBets);

// route for finishing all unfinished events
router.post('/finish-all', ...validate_request, event.finishAllEvents, betslip.processBets);

// route for getting all odds for all unfinished events
router.get('/quotas', quota.get);

// route for getting all odds for all events even finished
router.get('/all-quotas', quota.getAll);

// route for getting all odds for selected event
router.get('/:event_id/quotas', quota.getByEvent);

// route for adding new odd for selected event
router.post('/:event_id/quotas/add', ...validate_request, quota.checkUnique, quota.add);

// route for getting all odds for all unfinished events
router.post('/quotas/remove', ...validate_request, quota.remove);

module.exports = router;