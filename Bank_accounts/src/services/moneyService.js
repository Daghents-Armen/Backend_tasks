const pool = require('../db');
const { insertTransaction } = require('../models/transactions');

async function deposit({accountId, amount, reference, note}){
    const client = await pool.connect();

    try {
    await client.query('BEGIN');
    
    const accountRes = await client.query('SELECT id, balance, status FROM accounts WHERE id = $1 FOR UPDATE', [accountId]);

    if(accountRes.rows.length === 0){
        throw new Error('account not found');
    }

    const account = accountRes.rows[0];

    if(account.status !== 'active'){
        throw new Error('account is not active');
    }

    if(amount <= 0){
        throw new Error('amount must be positive');
    }

    const newBalance = account.balance + amount;

    await client.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newBalance, accountId]);

    await insertTransaction({
        type: 'deposit',
        toAccountId: accountId,
        amount,
        reference,
        note
    }, client);

    await client.query('INSERT INTO audit_logs (action, meta) VALUES ($1, $2)', ['deposit', JSON.stringify(accountId, amount, reference)]);
    
    await client.query('COMMIT');

    return {
        success: true,
        balance: newBalance
    };


    } catch(error){
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    deposit
}

async function withdraw({ accountId, amount, reference, note }) {
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const accountRes = await client.query(
        `SELECT id, balance, status FROM accounts WHERE id = $1 FOR UPDATE`,
        [accountId]
      );
  
      if (accountRes.rows.length === 0) throw new Error('Account not found');
      const account = accountRes.rows[0];
  
      if (account.status !== 'active') throw new Error('Account is not active');
      if (amount <= 0) throw new Error('Amount must be positive');
      if (amount > account.balance) throw new Error('Insufficient balance');
  
      const newBalance = account.balance - amount;
  
      await client.query(
        `UPDATE accounts SET balance = $1 WHERE id = $2`,
        [newBalance, accountId]
      );

      await insertTransaction(
        {
          type: 'withdraw',
          fromAccountId: accountId,
          amount,
          reference,
          note
        },
        client
      );
  
      await client.query(
        `INSERT INTO audit_logs (action, meta) VALUES ($1, $2)`,
        ['WITHDRAW', JSON.stringify({ accountId, amount, reference })]
      );
  
      await client.query('COMMIT');
  
      return { success: true, balance: newBalance };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  

  async function transfer({ fromAccountId, toAccountId, amount, reference, note }) {
    if (fromAccountId === toAccountId) throw new Error('Cannot transfer to the same account');
  
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      const accountsRes = await client.query(
        `
        SELECT id, balance, status
        FROM accounts
        WHERE id = ANY($1)
        FOR UPDATE
        `,
        [[fromAccountId, toAccountId]]
      );
  
      if (accountsRes.rows.length !== 2) throw new Error('One or both accounts not found');
  
      const fromAccount = accountsRes.rows.find(a => a.id === fromAccountId);
      
      const toAccount = accountsRes.rows.find(a => a.id === toAccountId);
  
      if (fromAccount.status !== 'active' || toAccount.status !== 'active')
        throw new Error('One or both accounts are not active');
  
      if (amount <= 0) throw new Error('Amount must be positive');

      if (amount > fromAccount.balance) throw new Error('Insufficient balance');
  
      const newFromBalance = fromAccount.balance - amount;
      const newToBalance = toAccount.balance + amount;
  
      await client.query(`UPDATE accounts SET balance = $1 WHERE id = $2`, [newFromBalance, fromAccountId]);

      await client.query(`UPDATE accounts SET balance = $1 WHERE id = $2`, [newToBalance, toAccountId]);
  
      await insertTransaction(
        { type: 'transfer', fromAccountId, toAccountId, amount, reference, note },
        client
      );
  
      await client.query(
        `INSERT INTO audit_logs (action, meta) VALUES ($1, $2)`,
        ['transfer', JSON.stringify({ fromAccountId, toAccountId, amount, reference })]
      );
  
      await client.query('COMMIT');
  
      return { success: true, fromBalance: newFromBalance, toBalance: newToBalance };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  module.exports = {
    deposit,
    withdraw,
    transfer
  };