const express = require('express');
const routineLineController = require('./routineLineController');
const validateRoutineLine = require('./routineLineValidation');
const validateRole = require('../../middlewares/validateRole');
const router = express.Router();

router.get('/:id', validateRole.validateRole('professor'), routineLineController.getRoutineLineById);

router.put('/:id',validateRoutineLine.validateUpdateRoutineLine, validateRole.validateRole('professor'), routineLineController.updateRoutineLine);

router.delete('/:id', validateRole.validateRole('professor'), routineLineController.deleteRoutineLine);

module.exports = router