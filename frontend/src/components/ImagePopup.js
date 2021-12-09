export function ImagePopup(props) {
    return(
        <div className={`popup popup_show-image ${props.card.name !== '' ? 'popup_opened' : null}`}>
        <div className="popup__img-container">
            <button className="popup__close-button transition" type="button" area-label="Закрыть" onClick={props.onClose}></button>
            <img className="popup__img" src={props.card.link} alt={props.card.name} />
            <h2 className="popup__title">{props.card.name}</h2>
        </div>
    </div>
    )
}