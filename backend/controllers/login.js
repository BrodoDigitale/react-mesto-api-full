const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'c77b130afd3bf9cd159f21ede3c1673cc1ff764c5e37b0a0d675d13394f6e5e7',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { httpOnly: true }).send({ message: 'Вы успешно авторизованы' });
    })
    .catch(next);
};
