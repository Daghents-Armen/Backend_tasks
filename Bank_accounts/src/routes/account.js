const express = require('express');
const router = express.Router();
const {
  createAccountHandler,
  getAccountHandler,
  updateStatusHandler,
  depositHandler,
  withdrawHandler,
  transferHandler
} = require('../controllers/accountsController');

router.post('/', createAccountHandler);
router.get('/:id', getAccountHandler);
router.patch('/:id/status', updateStatusHandler);
router.post('/:id/deposit', depositHandler);
router.post('/:id/withdraw', withdrawHandler);
router.post('/transfers', transferHandler);

module.exports = router;
