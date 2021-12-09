import logo from '../images/Logo_mesto.svg'

export function Header(props) {
    return(
    <header className="header">
        <div className="header__container">
        <img className="header__logo" src={logo} alt="логотип Место" />
        <div className="header__text-wrapper">
        {props.children}
        <button className="header__button transition" onClick={props.onClick}>{props.headerButtonText}</button>
        </div>
        </div>
    </header>
    )
}