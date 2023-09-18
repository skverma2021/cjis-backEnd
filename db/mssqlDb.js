// const mssql = require('mssql');
// const dotenv = require('dotenv');
// dotenv.config({ path: '../config/config.env' });
const theConfig = require('config');

// const config = {
//   server: 'VERMARNCDBG',
//   database: 'CJIS',
//   user: 'apiUserLogin',
//   password: 'theApiUser',
//   trustServerCertificate: true,
// };
const config = {
  server: 'VERMARNCDBG',
  database: 'CJIS',
  user: 'apiUserLogin',
  password: theConfig.get('thePass'),
  trustServerCertificate: true,
};
//PS C:\uproj-three\node> $env:cjisPass="theApiUser"

module.exports = config;
