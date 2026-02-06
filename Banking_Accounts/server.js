require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const customerRoutes = require('./routes/customers');
const accountRoutes = require('./routes/accounts');
const transferRoutes = require('./routes/transfers');

const app = express();
app.use(bodyParser.json());

app.use('/api/customers', customerRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transfers', transferRoutes);
app.get('/', (req, res) => res.send('Banking Backend is running'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
