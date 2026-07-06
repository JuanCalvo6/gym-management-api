const express = require('express');
const clientController = require('./clientController');
const validateRole = require('../../middlewares/validateRole');
const validateClient = require('./clientValidation');


const router = express.Router();

router.post('/', validateRole.validateRole('professor'), validateClient.validateClient, clientController.createClient);

router.get('/', validateRole.validateRole('professor'), clientController.getAllClients);
router.get('/:id', validateRole.validateRole('professor'), clientController.getClientById);

router.put('/:id', validateRole.validateRole('professor'), clientController.updateClient);

router.patch('/:id/deactivate', validateRole.validateRole('professor'), clientController.deactivateClient);
router.patch('/:id/activate', validateRole.validateRole('professor'), clientController.activateClient);

module.exports = router;