const express = require('express');
const {getCalendarByDate} = require('../controllers/calendar');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../middleware/auth');

router.route('/').get(authorize('admin'), getCalendarByDate);

module.exports = router;