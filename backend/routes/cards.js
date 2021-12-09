const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const InvalidDataError = require('../errors/invalid-data-err');

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);
router.post('/', celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom((value) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new InvalidDataError('Поле link не является ссылкой');
        }
        return value;
      }),
    }),
  },
), createCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = router;
