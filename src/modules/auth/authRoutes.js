const express = require('express');
const router = express.Router();
const authController = require('./authController');
const authValidation = require('./authValidation');
const validateToken = require('../../middlewares/validateToken');

router.post('/login', authValidation.validationLogin, authController.login);

router.post('/logout',authController.logout);

router.get('/verify',validateToken.validateToken, authController.verifyToken);

module.exports = router;