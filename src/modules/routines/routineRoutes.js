const express = require('express');
const routineController = require('./routineController');
const validateRoutine = require('./routineValidation'); 
const validateRole = require('../../middlewares/validateRole');

const router = express.Router();

router.get('/:id', validateRole.validateRole('professor'), routineController.getRoutineById);

router.put('/:id', validateRoutine.validateUpdateRoutine , validateRole.validateRole('professor'), routineController.updateRoutine);

router.patch('/:id/deactivate', validateRole.validateRole('professor'), routineController.deactivateRoutine);
router.patch('/:id/activate', validateRole.validateRole('professor'), routineController.activateRoutine);

router.delete('/:id', validateRole.validateRole('professor'), routineController.deleteRoutine);

module.exports = router;