const express = require('express');
const router = express.Router();

router.use('/user', require('./api/user'));
router.use('/sport', require('./api/sport'));

module.exports = router;