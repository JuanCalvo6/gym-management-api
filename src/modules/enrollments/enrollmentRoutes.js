const express = require('express');

const validateRole = require('../../middlewares/validateRole');

const router = express.Router();

router.get('/');
router.get('/:id');

router.patch('/:id/deactivate');
router.patch('/:id/activate');





module.exports = router;