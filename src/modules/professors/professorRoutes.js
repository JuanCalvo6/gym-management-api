const express = require('express');
const professorController =  require('./professorController');
const professorValidation = require('./professorValidation');
const passwordValidation = require('./passwordValidation');
const validateRole = require('../../middlewares/validateRole');

const router = express.Router();

router.post('/',professorValidation.validateProfessor ,validateRole.validateRole('admin'), professorController.createProfessor);

router.get('/',validateRole.validateRole('admin'), professorController.getAllProfessors);
router.get('/:id', professorController.getProfessorById);

router.put('/:id',validateRole.validateRole('admin'),  professorController.updateProfessor);

router.patch('/:id/deactivate',validateRole.validateRole('admin'),  professorController.deactivateProfessor);
router.patch('/:id/activate',validateRole.validateRole('admin'),  professorController.activateProfessor);

router.patch('/:id/password', passwordValidation.validatePassword, validateRole.validateRole('admin'), professorController.updateProfessorPassword);


module.exports = router;