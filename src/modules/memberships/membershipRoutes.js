const express = require('express');
const membershipController = require('./membershipController');
const membershipValidation = require('./membershipValidation');
const validateRole = require('../../middlewares/validateRole');


const router = express.Router();

router.post('/',membershipValidation.validateMembership, validateRole.validateRole('admin'), membershipController.createMembership);


module.exports = router;