const express = require('express');
const clientController = require('./clientController');
const enrollmentController = require('../enrollments/enrollmentController');
const attendanceController = require('../attendances/attendanceController');
const routineController = require('../routines/routineController');
const validateRole = require('../../middlewares/validateRole');
const validateClient = require('./clientValidation');
const validateEnrollment = require('../enrollments/enrollmentValidation');
const validateRoutine = require('../routines/routineValidation');

const router = express.Router();

router.post('/', validateRole.validateRole('professor'), validateClient.validateClient, clientController.createClient);
router.post('/:id/enrollments', validateRole.validateRole('professor'), validateEnrollment.validateEnrollment, enrollmentController.createEnrollment);
router.post('/:id/attendances', validateRole.validateRole('professor'), attendanceController.createAttendance);
router.post('/:id/routines', validateRoutine.validateCreateRoutine, validateRole.validateRole('professor'), routineController.createRoutine);

router.get('/', validateRole.validateRole('professor'), clientController.getAllClients);
router.get('/:id', validateRole.validateRole('professor'), clientController.getClientById);
router.get('/:id/enrollments', validateRole.validateRole('professor'), enrollmentController.getEnrollmentsByClient);
router.get('/:id/attendances', validateRole.validateRole('professor'), attendanceController.getAttendancesByClient);
router.get('/:id/routines', validateRole.validateRole('professor'), routineController.getRoutinesByClient);

router.put('/:id', validateRole.validateRole('professor'), clientController.updateClient);

router.patch('/:id/deactivate', validateRole.validateRole('professor'), clientController.deactivateClient);
router.patch('/:id/activate', validateRole.validateRole('professor'), clientController.activateClient);

module.exports = router;