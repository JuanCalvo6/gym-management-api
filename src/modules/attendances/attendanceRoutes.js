const express = require('express');

const attendanceController = require('./attendanceController');
const validateRole = require('../../middlewares/validateRole');

const router = express.Router();

router.get('/', validateRole.validateRole('admin'), attendanceController.getAllAttendances);

module.exports = router;

