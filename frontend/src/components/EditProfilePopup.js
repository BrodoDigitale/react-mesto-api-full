
import React from "react";
import { PopupWithForm } from "./PopupWithForm";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export function EditProfilePopup(props) {
        //Подписка на контекст юзера
    const currentUser = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
      }, [currentUser, props.isOpen]);
    //Задание стейта 
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    //Управление полями
    function nameHandleChange(e) {
        setName(e.target.value);
      }
      function descriptionHandleChange(e) {
        setDescription(e.target.value);
      }
    
    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();
        // Передаём значения управляемых компонентов во внешний обработчик
        props.onUpdateUser({
          name,
          about: description,
        });
      }

    return(
        <PopupWithForm 
        name={'editProfile'}
        title={'Редактировать профиль'}
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={handleSubmit}
        buttonText={'Сохранить'}>
            <input className="edit-form__input edit-form__input_value_name" type="text" id="edit-form__name" name="userName" value={name||""} onChange={nameHandleChange} required minLength="2" maxLength="40" placeholder="Имя"/>
            <span className="edit-form__error" id="edit-form__name-error"></span>
            <input className="edit-form__input edit-form__input_value_about" type="text" id="edit-form__about" name="userInfo" value={description||""} onChange={descriptionHandleChange} required minLength="2" maxLength="200" placeholder="Вид деятельности"/>
            <span className="edit-form__error" id="edit-form__about-error"></span>
        </PopupWithForm>
    )
    }