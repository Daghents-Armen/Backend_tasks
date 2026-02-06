const { pool } = require('../models/db');

async function transfer(req, res) {
  const { fromAccountId, toAccountId, amount, reference, note } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'Amount must be positive' });
  if (fromAccountId === toAccountId) return res.status(400).json({ error: 'Cannot transfer to same account' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const fromAccRes = await client.query('SELECT * FROM accounts WHERE id = $1 FOR UPDATE', [fromAccountId]);
    const toAccRes = await client.query('SELECT * FROM accounts WHERE id = $1 FOR UPDATE', [toAccountId]);
    if (!fromAccRes.rows.length || !toAccRes.rows.length) throw new Error('Account not found');

    const fromAcc = fromAccRes.rows[0];
    const toAcc = toAccRes.rows[0];
    if (fromAcc.status !== 'active' || toAcc.status !== 'active') throw new Error('Account not active');
    if (fromAcc.balance < amount) throw new Error('Insufficient funds');

    const refCheck = await client.query('SELECT * FROM transactions WHERE reference = $1', [reference]);
    if (refCheck.rows.length) throw new Error('Duplicate reference');

    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromAccountId]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toAccountId]);

    await client.query(
      'INSERT INTO transactions (type, from_account_id, to_account_id, amount, reference, note) VALUES ($1,$2,$3,$4,$5,$6)',
      ['transfer', fromAccountId, toAccountId, amount, reference, note]
    );

    await client.query(
      'INSERT INTO audit_logs (action, meta) VALUES ($1, $2)',
      ['transfer', JSON.stringify({ fromAccountId, toAccountId, amount, reference, note })]
    );

    await client.query('COMMIT');
    res.json({ message: 'Transfer successful' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
}

module.exports = { transfer };
