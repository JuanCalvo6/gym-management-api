const express = require('express');
const professorController =  require('./professorController');
const professorValidation = require('./professorValidation');

const router = express.Router();

router.post('/',professorValidation.validateProfessor ,professorController.createProfessor);

router.get('/',professorController.getAllProfessors);
router.get('/:id', professorController.getProfessorById);


module.exports = router;