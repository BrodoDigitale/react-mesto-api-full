const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const InvalidDataError = require('../errors/invalid-data-err');
const DataBaseError = require('../errors/dataBase-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(new NotFoundError('Пользователи не найдены'))
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Невалидный id'));
      }
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Невалидный id'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new DataBaseError('Данный емейл уже зарегистрирован');
      } return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Введены некорректные данные'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Введены некорректные данные'));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Введены некорректные данные'));
      }
      next(err);
    });
};
