const colors = require('colors');

//@Desc logs request
const logger = (req, res, next) => {
  // console.log('Hi');
  console.log(
    `Custom Middleware-Logger: ${req.method} ${req.protocol}://${req.get(
      'host'
    )}/${req.originalUrl}`.green
  );
  next();
};
module.exports = logger;
