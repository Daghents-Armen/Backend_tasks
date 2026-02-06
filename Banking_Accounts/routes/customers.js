const express = require('express');
const router = express.Router();
const { createCustomer, getCustomer } = require('../controllers/customers');

router.post('/', createCustomer);
router.get('/:id', getCustomer);

module.exports = router;
