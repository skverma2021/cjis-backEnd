const mssql = require('mssql');

var con = mssql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'apiUser',
  password: 'theApiUser',
  database: 'cjis',
});

module.exports = con;
