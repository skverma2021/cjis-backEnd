const jwt = require('jsonwebtoken');
const configJwt = require('config');

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    // Handle the case where no token is provided
    return res.status(401).json({ msg: 'No token provided' });
  }
  const tokenValue = token.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(tokenValue, configJwt.get('jwtPrivateKey'));
    req.user = decoded;
    // console.log('Hi from middleware');
    // console.log((Math.floor(Date.now()) - parseInt(decoded.iat) * 1000) / 1000);
    req.elapsedTime = Math.floor(
      (Math.floor(Date.now()) - parseInt(decoded.iat) * 1000) / 1000
    );
    next();
  } catch (error) {
    return res.status(400).send('Invalid Token');
  }
};

module.exports = auth;
