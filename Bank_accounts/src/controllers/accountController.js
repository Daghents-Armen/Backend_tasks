const { createAccount, getAccountById, updateAccountStatus } = require('../models/accounts');
const { deposit, withdraw, transfer } = require('../services/moneyService');

async function createAccountHandler(req, res) {
  try {
    const { customerId, currency } = req.body;

    const account = await createAccount({ customerId, currency });

    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAccountHandler(req, res) {
  try {
    const { id } = req.params;

    const account = await getAccountById(id);

    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateStatusHandler(req, res) {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const account = await updateAccountStatus(id, status);

    res.json(account);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function depositHandler(req, res) {
  try {
    const { id } = req.params;

    const { amount, reference, note } = req.body;

    const result = await deposit({ accountId: id, amount, reference, note });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function withdrawHandler(req, res) {
  try {
    const { id } = req.params;

    const { amount, reference, note } = req.body;

    const result = await withdraw({ accountId: id, amount, reference, note });

    res.json(result);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function transferHandler(req, res) {
  try {
    const { fromAccountId, toAccountId, amount, reference, note } = req.body;

    const result = await transfer({ fromAccountId, toAccountId, amount, reference, note });

    res.json(result);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createAccountHandler,
  getAccountHandler,
  updateStatusHandler,
  depositHandler,
  withdrawHandler,
  transferHandler
};
