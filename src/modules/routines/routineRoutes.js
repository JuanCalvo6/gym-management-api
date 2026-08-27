const express = require('express');
const routineController = require('./routineController');
const routineLineController = require('../routineLines/routineLineController');
const validateRoutine = require('./routineValidation'); 
const validateRoutineLine = require('../routineLines/routineLineValidation');
const validateRole = require('../../middlewares/validateRole');

const router = express.Router();

router.post('/:id/lines',validateRoutineLine.validateCreateRoutineLine, validateRole.validateRole('professor'), routineLineController.createRoutineLine);

router.get('/:id', validateRole.validateRole('professor'), routineController.getRoutineById);
router.get('/:id/lines', validateRole.validateRole('professor'), routineLineController.getRoutineLinesByRoutine);

router.put('/:id', validateRoutine.validateUpdateRoutine , validateRole.validateRole('professor'), routineController.updateRoutine);

router.patch('/:id/deactivate', validateRole.validateRole('professor'), routineController.deactivateRoutine);
router.patch('/:id/activate', validateRole.validateRole('professor'), routineController.activateRoutine);

router.delete('/:id', validateRole.validateRole('professor'), routineController.deleteRoutine);

module.exports = router;