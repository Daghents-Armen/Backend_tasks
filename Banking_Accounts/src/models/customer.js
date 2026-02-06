const pool = require('../db');

async function createCustomer(full_name, email, phone){
    try {
    const res = await pool.query('INSERT INTO customers (full_name, email, phone) VALUES ($1, $2, $3) RETURNING *', [full_name, email, phone || null]);

    return res.rows[0];

    } catch(error){
        throw error;
    }
};

async function getCustomerByid(id){
    try {
    const customerRes = await pool.query('SELECT id, full_name, email, phone, created_at FROM customers WHERE customer_id = $1', [id]);
    
    const customer = customerRes.rows[0];

    if(!customer) return null;

    const accountsRes = await pool.query('SELECT id, currency, balance, status, created_at FROM accounts WHERE customer_id = $1', [id]);

    return {
        ...customer,
        accounts: accountsRes.rows
    }
    } catch(error){
        throw error;
    }
}

module.exports = {
    createCustomer,
    getCustomerByid
}