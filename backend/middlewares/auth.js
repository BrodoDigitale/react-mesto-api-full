const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new AuthError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, 'c77b130afd3bf9cd159f21ede3c1673cc1ff764c5e37b0a0d675d13394f6e5e7');
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
