const express = require('express');
const router = express.Router();
const { createAccount, getAccount, updateStatus, deposit, withdraw } = require('../controllers/accounts');

router.post('/', createAccount);
router.get('/:id', getAccount);
router.patch('/:id/status', updateStatus);
router.post('/:id/deposit', deposit);
router.post('/:id/withdraw', withdraw);

module.exports = router;
