require('dotenv').config({quiet: true});

const {Pool} = require('pg');

const pool = new Pool({
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER
});

module.exports = {pool};