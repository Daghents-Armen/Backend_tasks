const { createCustomer, getCustomerById } = require('../models/customers');

async function createCustomerHandler(req, res) {
  try {
    const { full_name, email, phone } = req.body;

    const customer = await createCustomer({ full_name, email, phone });

    res.status(201).json(customer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCustomerHandler(req, res) {
  try {
    const { id } = req.params;

    const customer = await getCustomerById(id);

    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createCustomerHandler,
  getCustomerHandler
};
