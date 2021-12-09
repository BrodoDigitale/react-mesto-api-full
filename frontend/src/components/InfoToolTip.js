import RegistrationSuccessPic from '../images/RegistrationSuccess.svg'
import RegistrationFailedPic from '../images/RegFailed.svg'

export function InfoToolTip(props) {
    return(
        <div className= {`popup ${props.isOpen ? 'popup_opened' : null}`}>
        <div className="popup__container">
            <div className="popup__notification-container">
            <button className="popup__close-button transition" type="button" area-label="Закрыть" onClick={props.onClose}></button>
            <img className="popup__notification-img"
            src={`${props.isRegistrationSuccessful ? RegistrationSuccessPic : RegistrationFailedPic}`} 
            alt={`${props.isRegistrationSuccessful ? "Вы зарегистрированы" : "Что-то пошло не так"}`}/>
            <h2 className="popup__notification-title">
            {`${props.isRegistrationSuccessful ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте еще раз."}`}   
            </h2>
            </div>
        </div>
    </div>
    )
}