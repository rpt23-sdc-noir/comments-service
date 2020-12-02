const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'abhogle',
  password: 'postgres',
  database: 'sdc_comments',
  host: 'localhost',
  port: 5432,
});

module.exports = pool;
