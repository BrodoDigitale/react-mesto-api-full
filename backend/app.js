const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const validator = require('validator');
const auth = require('./middlewares/auth');
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
