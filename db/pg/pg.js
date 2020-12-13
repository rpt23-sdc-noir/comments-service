const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: 'sdc_comments',
  host: process.env.POSTGRES_HOST,
  port: 5432,
});

module.exports = pool;
