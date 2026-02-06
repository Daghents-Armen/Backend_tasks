const { pool } = require('../models/db');

async function createAccount(req, res) {
  const { customerId, currency } = req.body;
  if (!['AMD','USD','EUR'].includes(currency)) return res.status(400).json({ error: 'Invalid currency' });

  try {
    const customer = await pool.query('SELECT * FROM customers WHERE id = $1', [customerId]);
    if (!customer.rows.length) return res.status(404).json({ error: 'Customer not found' });

    const result = await pool.query(
      'INSERT INTO accounts (customer_id, currency, status) VALUES ($1,$2,$3) RETURNING *',
      [customerId, currency, 'active']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function getAccount(req, res) {
  const { id } = req.params;
  try {
    const account = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
    if (!account.rows.length) return res.status(404).json({ error: 'Account not found' });
    res.json(account.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  if (!['active','frozen','closed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

  try {
    const account = await pool.query('UPDATE accounts SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (!account.rows.length) return res.status(404).json({ error: 'Account not found' });
    res.json(account.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function deposit(req, res) {
  const { id } = req.params;
  const { amount, reference, note } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'Amount must be positive' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const accountRes = await client.query('SELECT * FROM accounts WHERE id = $1 FOR UPDATE', [id]);
    if (!accountRes.rows.length) throw new Error('Account not found');
    const account = accountRes.rows[0];
    if (account.status !== 'active') throw new Error('Account is not active');

    const refCheck = await client.query('SELECT * FROM transactions WHERE reference = $1', [reference]);
    if (refCheck.rows.length) throw new Error('Duplicate reference');

    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, id]);

    await client.query(
      'INSERT INTO transactions (type, to_account_id, amount, reference, note) VALUES ($1,$2,$3,$4,$5)',
      ['deposit', id, amount, reference, note]
    );

    await client.query(
      'INSERT INTO audit_logs (action, meta) VALUES ($1,$2)',
      ['deposit', JSON.stringify({ accountId: id, amount, reference, note })]
    );

    await client.query('COMMIT');
    res.json({ message: 'Deposit successful' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
}

async function withdraw(req, res) {
  const { id } = req.params;
  const { amount, reference, note } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'Amount must be positive' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const accountRes = await client.query('SELECT * FROM accounts WHERE id=$1 FOR UPDATE', [id]);
    if (!accountRes.rows.length) throw new Error('Account not found');
    const account = accountRes.rows[0];
    if (account.status !== 'active') throw new Error('Account is not active');
    if (account.balance < amount) throw new Error('Insufficient funds');

    const refCheck = await client.query('SELECT * FROM transactions WHERE reference=$1', [reference]);
    if (refCheck.rows.length) throw new Error('Duplicate reference');

    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id=$2', [amount, id]);

    await client.query(
      'INSERT INTO transactions (type, from_account_id, amount, reference, note) VALUES ($1,$2,$3,$4,$5)',
      ['withdraw', id, amount, reference, note]
    );

    await client.query(
      'INSERT INTO audit_logs (action, meta) VALUES ($1,$2)',
      ['withdraw', JSON.stringify({ accountId: id, amount, reference, note })]
    );

    await client.query('COMMIT');
    res.json({ message: 'Withdraw successful' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
}

module.exports = { createAccount, getAccount, updateStatus, deposit, withdraw };
