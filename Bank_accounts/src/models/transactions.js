const pool = require('../db');

async function insertTransaction({
    type,
    fromAccountId = null,
    toAccountId = null,
    amount,
    reference,
    note = null
}, client) {

    if (!['deposit', 'withdraw', 'transfer'].includes(type)) {
        throw new Error('Invalid transaction type');
    }

    if(amount >= 0){
        throw new Error('amount must be greater than zero');
    }

    if(type === 'deposit'){
        if(!toAccountId || fromAccountId !== null){
            throw new Error('invalid deposit transactions');
        }
    }

    if (type === 'transfer') {
        if (!fromAccountId || !toAccountId) {
          throw new Error('Invalid transfer transaction');
        }
        if (fromAccountId === toAccountId) {
          throw new Error('Cannot transfer to the same account');
        }
      }


      try {
        const result = await client.query(
          `
          INSERT INTO transactions (
            type,
            from_account_id,
            to_account_id,
            amount,
            reference,
            note
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
          `,
          [
            type,
            fromAccountId,
            toAccountId,
            amount,
            reference,
            note
          ]
        );
    
        return result.rows[0];

      } catch (error) {
        throw error;
      }
};

module.exports = {
    insertTransaction
};