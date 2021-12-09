import { Header } from "./Header";
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

export function Register(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    function handleSubmit(e) {
        e.preventDefault();
        props.onRegister({
          email,
          password,
        });
        setEmail("")
        setPassword("")
      }

    return (
    <div className="page">
        <Header headerButtonText="Войти" onClick={() => history.push('/sign-in')}/>
        <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-form__header">Регистрация</h2>
        <input 
        className="auth-form__input" 
        id="authEmail" 
        placeholder="Email" 
        type="email"
        value={email||""}
        name="userEmail"
        onChange={e => setEmail(e.target.value)}
        required />
        <input 
        className="auth-form__input" 
        id="authPassword" 
        placeholder="Пароль" 
        type="password" 
        name="userPassword"
        value={password||""}
        onChange={e => setPassword(e.target.value)}
        required />
        <button className="auth-form__button" type="submit">Зарегистрироваться</button>
        <Link className="auth-form__link transition" to="/sign-in">Уже зарегистрированы? Войти</Link>
        </form>
    </div>
    )
    }
