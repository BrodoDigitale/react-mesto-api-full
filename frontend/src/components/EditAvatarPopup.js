import React from "react";
import { PopupWithForm } from "./PopupWithForm";


export function EditAvatarPopup(props) {

//Присвоение значения инпута через реф
const avatarRef = React.useRef();


//Обработчик сабмита
    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateAvatar({
        avatar: avatarRef.current.value
        });
        e.target.reset()
      } 

return(
    <PopupWithForm 
        name={'editAvatar'}
        title={'Обновить аватар'}
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={handleSubmit}
        buttonText={'Сохранить'}
        >
            <input ref={avatarRef} className="edit-form__input edit-form__avatarLink" id="edit-form__avatarLink" placeholder="Ссылка на аватар" type="url" name="link" required />
            <span className="edit-form__error" id="edit-form__avatarLink-error"></span>
    </PopupWithForm>
)
}