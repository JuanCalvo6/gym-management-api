const express = require('express');
const membershipController = require('./membershipController');
const membershipValidation = require('./membershipValidation');
const validateRole = require('../../middlewares/validateRole');


const router = express.Router();

router.post('/',membershipValidation.validateMembership, validateRole.validateRole('admin'), membershipController.createMembership);

router.get('/', membershipController.getAllMemberships);
router.get('/:id', membershipController.getMembershipById);

router.put('/:id', membershipController.updateMembership);

router.patch('/:id/deactivate', membershipController.deactivateMembership);
router.patch('/:id/activate', membershipController.activateMembership);



module.exports = router;