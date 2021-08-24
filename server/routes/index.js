const express = require('express');
const router = express.Router();

router.use('/user', require('./api/user'));
router.use('/sport', require('./api/sport'));
router.use('/player', require('./api/player'));
router.use('/competition', require('./api/competition'));
router.use('/event', require('./api/event'));

module.exports = router;