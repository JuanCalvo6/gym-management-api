const express = require('express');
const router = express.Router();
const authController = require('./authController');
const authValidation = require('./authValidation');

router.post('/login', authValidation.validationLogin, authController.login);

router.post('/logout',authController.logout);

router.get('/verify', authController.verifyToken);

module.exports = router;