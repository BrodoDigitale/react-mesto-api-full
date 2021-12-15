const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const SECRET_KEY_DEV = 'fc3dc3850a743218568b5738df1d608128f7840ed98c6d8ca78691c6947f75a0';

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY_DEV,
        { expiresIn: '7d' },
      );
      res.send({ message: 'Вы успешно авторизованы', token });
    })
    .catch(next);
};

module.exports = {
  SECRET_KEY_DEV,
  login,
};
