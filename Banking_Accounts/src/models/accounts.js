const pool = require('../db');

async function createAccount(customerId, currency){
    try {
    if(!['AMD', 'USD', 'EUR'].includes(currency)){
        throw new Error('invalid currency');
    }  

    const accountRes = pool.query(`INSERT INTO accounts (customer_id, currency, balance, status) VALUES ($1, $2, 0, 'active') RETURNING *`, [customerId, currency]);

    return accountRes.rows[0];

    } catch(error){
        throw error;
    }
};

async function getAccountbyId(id){
    try {
    const accountRes = pool.query('SELECT id, customer_id, currency, balance, status, created_at FROM accounts WHERE id = $1');

    return accountRes.rows[0] || null;
    
    } catch(error){
        throw error;
    }
};

async function updateAccountStatus(id, status){
    try {
    if(!['active', 'frozen', 'closed'].includes(status)){
        throw new Error('invalid status');
    }

    const res = pool.query('UPDATE accounts SET status = $1 WHERE id = $2 RETURNING *', [status, id]);

    return res.rows[0] || null;

    } catch(error){
        throw error;
    }
};

module.exports = {
    createAccount,
    getAccountbyId,
    updateAccountStatus
};
