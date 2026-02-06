const express = require('express');
const app = express();
app.use(express.json());

const customersRoutes = require('./routes/customers');
const accountsRoutes = require('./routes/accounts');

app.use('/api/customers', customersRoutes);
app.use('/api/accounts', accountsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
