
import React from 'react';
import { Card } from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export function Main (props) {

  
//Подписка на контекст аватара
    const user = React.useContext(CurrentUserContext);

    return(
    <main className="content">
            <section className="profile">
                <div className="profile__info">
                    <button className="profile__avatar-button" type="button" aria-label="Сменить_аватар" 
                    onClick={props.onEditAvatar}/>
                    <div className="profile__avatar" style={{ backgroundImage: `url(${user.avatar})`}}/>
                    <div className="profile__grid">
                      <div className="profile__name-wrapper">
                        <h1 className="profile__name">{user.name}</h1>
                        <button className="profile__edit-button transition" type="button" aria-label="Редактировать_профиль"
                        onClick={props.onEditProfile}/>
                      </div>
                        <p className="profile__about">{user.about}</p>
                    </div>
                </div>
                <button className="profile__add-button transition" type="button" aria-label="Добавить_изображение"
                onClick={props.onAddPlace}/>
            </section>
            <section className="elements">
                 <ul className="elements__list">
                 {props.cards.map((card) => {
                     return(
                        <Card 
                        card={card}
                        key={card._id}
                        onCardClick={props.onCardClick}
                        onCardLike={props.onCardLike}
                        onCardDelete={props.onCardDelete}
                        />
                     )
                 })
            }
                 </ul>
            </section>
        </main>
    )
}
