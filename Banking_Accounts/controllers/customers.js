const { pool } = require('../models/db');

async function createCustomer(req, res) {
  const { full_name, email, phone } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO customers (full_name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [full_name, email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function getCustomer(req, res) {
  const { id } = req.params;
  try {
    const customer = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (!customer.rows.length) return res.status(404).json({ error: 'Customer not found' });

    const accounts = await pool.query('SELECT * FROM accounts WHERE customer_id = $1', [id]);
    res.json({ ...customer.rows[0], accounts: accounts.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createCustomer, getCustomer };
