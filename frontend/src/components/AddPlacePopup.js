import React from "react";
import { PopupWithForm } from "./PopupWithForm";

export function AddPlacePopup(props) {

    //Задание стейта 
    const [placeName, setPlaceName] = React.useState("");
    const [placePhoto, setPlacePhoto] = React.useState("");
    //Управление полями
    function placeNameHandleChange(e) {
        setPlaceName(e.target.value);
      }
      function placePhotoHandleChange(e) {
        setPlacePhoto(e.target.value);
      }
    
    function handleSubmit(e) {
        e.preventDefault();
        props.onAddPlace({
          name: placeName,
          link: placePhoto,
        });
        setPlaceName("")
        setPlacePhoto("")
      }
    return(
        <PopupWithForm 
        name={'addPlace'}
        title={'Новое место'}
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={handleSubmit}
        buttonText={'Создать'}>
                <input className="edit-form__input edit-form__input_value_place" id="edit-form__placeName" placeholder="Название" type="text" name="name" value={placeName||""} onChange={placeNameHandleChange} required minLength="3" maxLength="30"/>
                <span className="edit-form__error" id="edit-form__placeName-error"></span>
                <input className="edit-form__input edit-form__input_value_placePhoto" id="edit-form__placePhoto" placeholder="Ссылка на картинку" type="url" name="link" value={placePhoto||""} onChange={placePhotoHandleChange}  required/>
                <span className="edit-form__error" id="edit-form__placePhoto-error"></span>
        </PopupWithForm>  
    )
    }