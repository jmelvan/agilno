const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'on-time.cc',
  database: 'casino',
  password: '@%6#sW',
  port: 5432,
});

module.exports = { pool };