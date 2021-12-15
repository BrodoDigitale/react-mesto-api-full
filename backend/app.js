const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const validator = require('validator');
const auth = require('./middlewares/auth');
const corsValidator = require('./middlewares/cors-validator');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/users');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const NotFoundError = require('./errors/not-found-err');
const InvalidDataError = require('./errors/invalid-data-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cookieParser());
// Парсер данных

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключение к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
// логгер запросов
app.use(requestLogger);
app.use(corsValidator);

// !!КРАШ ТЕСТ СЕРВЕРА
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// рутинг
app.post('/signin', celebrate(
  {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  },
), login);
app.post('/signup', celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().custom((value) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new InvalidDataError('Поле avatar не является ссылкой');
        }
        return value;
      }),
      about: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  },
), createUser);
// авторизация
app.use(auth);
// роуты, защищённые авторизацией
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
// eslint-disable-next-line no-unused-vars
app.use(('*', (req, res, next) => {
  throw new NotFoundError('Страница не найдена');
}));
// подключаем логгер ошибок (! до обработчиков ошибок)
app.use(errorLogger);
// обработка ошибок celebrate
app.use(errors());
// централизованный обработчик ошибок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.statusCode === 500) {
    res.status(500).send({ message: `На сервере произошла ошибка ${err.name}: ${err.message}` });
    return;
  }
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// ТЕСТ КЛЮЧЕЙ JWT
const YOUR_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWI5MGYwMDQwZjRlOTMxMDVjMmU1NDEiLCJpYXQiOjE2Mzk1NTkyOTUsImV4cCI6MTY0MDE2NDA5NX0.9r5TYTg2r4l6QdVgyDkMi-U3FH5a8AZNSXT78RWC0d8';
// вставьте сюда JWT, который вернул публичный сервер

const SECRET_KEY_DEV = 'fc3dc3850a743218568b5738df1d608128f7840ed98c6d8ca78691c6947f75a0';
// вставьте сюда секретный ключ для разработки из кода

try {
  // eslint-disable-next-line no-unused-vars
  const payload = jwt.verify(YOUR_JWT, SECRET_KEY_DEV);

  console.log('\x1b[31m%s\x1b[0m', `
    Надо исправить. В продакшне используется тот же
    секретный ключ, что и в режиме разработки.
  `);
} catch (err) {
  if (err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
    console.log(
      '\x1b[32m%s\x1b[0m',
      'Всё в порядке. Секретные ключи отличаются',
    );
  } else {
    console.log(
      '\x1b[33m%s\x1b[0m',
      'Что-то не так',
      err,
    );
  }
}
