const express = require('express');
const professorController =  require('./professorController');
const professorValidation = require('./professorValidation');
const passwordValidation = require('./passwordValidation');

const router = express.Router();

router.post('/',professorValidation.validateProfessor ,professorController.createProfessor);

router.get('/',professorController.getAllProfessors);
router.get('/:id', professorController.getProfessorById);

router.put('/:id', professorController.updateProfessor);

router.patch('/:id/deactivate', professorController.deactivateProfessor);
router.patch('/:id/activate', professorController.activateProfessor);

router.patch('/:id/password', passwordValidation.validatePassword, professorController.updateProfessorPassword);


module.exports = router;