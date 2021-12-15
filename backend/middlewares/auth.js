const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');
const { SECRET_KEY_DEV } = require('../controllers/login');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    const key = NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY_DEV;
    payload = jwt.verify(token, key);
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
