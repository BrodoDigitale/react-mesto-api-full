import { Header } from "./Header"
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export function Login(props) {

    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
 
   //Передача данных инпутов во внешний обработчик
  function handleSubmit(e) {
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    props.onLogin({
      email,
      password,
    });
    setEmail("")
    setPassword("")
  }
    const history = useHistory();

    return (
    <>
    <div className="page">
        <Header headerButtonText="Регистрация" onClick={() => history.push('/signup')}/>
        <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-form__header">Вход</h2>
        <input 
        className="auth-form__input" 
        id="edit-form__authEmail" 
        placeholder="Email" 
        type="email"
        value={email||""}
        name="userEmail"
        onChange={e => setEmail(e.target.value)}
        required />
        <input 
        className="auth-form__input" 
        id="edit-form__authPassword" 
        placeholder="Пароль" 
        type="password" 
        name="userPassword"
        value={password||""}
        onChange={e => setPassword(e.target.value)}
        required />
        <button className="auth-form__button" type="submit">Войти</button>
        </form>
    </div>
    </>
    )
}