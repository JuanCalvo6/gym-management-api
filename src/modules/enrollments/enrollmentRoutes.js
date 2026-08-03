const express = require('express');
const enrollmentController = require('./enrollmentController');
const validateRole = require('../../middlewares/validateRole');

const router = express.Router();

router.get('/', validateRole.validateRole('admin'), enrollmentController.getAllEnrollments);
router.get('/:id', validateRole.validateRole('professor'), enrollmentController.getEnrollmentById);

router.patch('/:id/deactivate', validateRole.validateRole('professor'), enrollmentController.deactivateEnrollment);
router.patch('/:id/activate', validateRole.validateRole('professor'), enrollmentController.activateEnrollment);


module.exports = router;