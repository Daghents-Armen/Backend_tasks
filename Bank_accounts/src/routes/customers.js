const express = require('express');
const router = express.Router();
const { createCustomerHandler, getCustomerHandler } = require('../controllers/customersController');

router.post('/', createCustomerHandler);
router.get('/:id', getCustomerHandler);

module.exports = router;
