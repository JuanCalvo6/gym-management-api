const express = require('express');
const rutineController = require('./rutineController');
const validateRutine = require('./rutineValidation'); 
const validateRole = require('../../middlewares/validateRole');

const router = express.Router();

router.get('/:id', validateRole.validateRole('professor'), rutineController.getRutineById);

router.put('/:id', validateRutine.validateUpdateRutine , validateRole.validateRole('professor'), rutineController.updateRutine);

router.patch('/:id/deactivate', validateRole.validateRole('professor'), rutineController.deactivateRutine);
router.patch('/:id/activate', validateRole.validateRole('professor'), rutineController.activateRutine);

router.delete('/:id', validateRole.validateRole('professor'), rutineController.deleteRutine);

module.exports = router;