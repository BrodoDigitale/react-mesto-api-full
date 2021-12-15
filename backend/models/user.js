const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const { isURL } = require('validator');
const AuthError = require('../errors/auth-error');

// Схема пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Б.У. Кашкин',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Уральский поэт',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://art-mx.ru/sites/default/files/bukashkin.jpg',
    validate: {
      validator: (v) => isURL(v),
      message: 'Поле avatar не является ссылкой',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неверно указан email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
// метод модели пользователя для поиска по емейлу и паролю
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

// создание модели пользователя и экспорт
module.exports = mongoose.model('user', userSchema);
