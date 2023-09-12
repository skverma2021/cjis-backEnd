// const mssql = require('mssql');
const dotenv = require('dotenv');
dotenv.config({ path: '../config/config.env' });

const config = {
  server: 'VERMARNCDBG',
  database: 'CJIS',
  user: 'apiUserLogin',
  password: 'theApiUser',
  trustServerCertificate: true,
};

module.exports = config;
