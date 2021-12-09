import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export function Card(props) {
function handleClick() {
        props.onCardClick(props.card);
    }  
function handleLikeClick() {
        props.onCardLike(props.card)
    } 
function handleDeleteClick() {
        props.onCardDelete(props.card)
    } 
//Подписка на контекст аватара
const user = React.useContext(CurrentUserContext);

//Отисовка корзины
// Определяем, являемся ли мы владельцем текущей карточки
const isOwn = props.card.owner._id === user._id;
const cardDeleteButtonClassName = (
  `${isOwn ? 'elements__delete-btn' : 'elements__delete-btn_disabled'}`
); 

//Отисовка лайков
// Определяем, есть ли у карточки лайк, поставленный текущим пользователем
const isLiked = props.card.likes.some(i => i._id === user._id);
const cardLikeButtonClassName = (
    `${isLiked ? 'elements__like-icon_active' : 'elements__like-icon'}`
  ); 

return(
    <li className="elements__item">
    <button className={`${cardDeleteButtonClassName} transition`} onClick={handleDeleteClick} type="button" area-label="удалить"></button>
    <div  className="elements__img" style={{ backgroundImage: `url(${props.card.link})` }} onClick={handleClick}/>
    <div className="elements__title">
        <h2 className="elements__title-text">{props.card.name}</h2>
        <div className="elements__like-container">
            <button className={cardLikeButtonClassName} type="button" aria-label="Нравится" onClick={handleLikeClick}>
            </button>
            <p className="elements__like-number">{props.card.likes.length}</p>
        </div>
    </div>
</li>
)
}