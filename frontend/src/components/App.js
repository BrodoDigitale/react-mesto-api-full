//import './App.css';
import React, { useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import {api} from '../utils/api'
import { Header } from "./Header";
import { Main } from "./Main";
import { Footer } from "./Footer";
import { ImagePopup } from "./ImagePopup";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import { Login } from './Login';
import { login, register } from "../utils/apiAuth";
import { Register } from './Register';
import { ProtectedRoute } from './ProtectedRoute';
import { checkTokenValidity } from '../utils/apiAuth';
import { InfoToolTip } from "./InfoToolTip";

export function App() {
    const history = useHistory();
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({name: '', link: ''})
    //Стейты для infoToolTip
    const [isInfoToolOpen, setIsInfoToolOpen ] = React.useState(false);
    const [isRegistrationSuccessful, setIsRegistrationSuccessful] = React.useState(false)
    //стейт емейла и пароля юзера
    const [userEmail, setUserEmail] = React.useState('email@mail.com');
    //стейт авторизации юзера
    const [loggedIn, setIsLoggedIn] = React.useState(false);
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true)
    }
    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true)
    }
    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true)
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false)
        setIsEditProfilePopupOpen(false)
        setIsAddPlacePopupOpen(false)
        setIsInfoToolOpen(false)
        setSelectedCard({name: '', link: ''})
    }
    //обновление инфо о пользователе
    function handleUpdateUser(data) {
        api.updateUserData(data)
        .then((res)=> {
            setCurrentUser(res)
            closeAllPopups()
        })
        .catch(err => console.log(err));
    }
    //Изменение аватара
    function handleUpdateAvatar(data) {
        api.updateAvatar(data.avatar)
        .then((res) => {
            setCurrentUser(res)
            closeAllPopups()
        })
        .catch(err => console.log(err));
    }
    
    //Проверка токена при загрузке страницы 
    React.useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            //setIsLoggedIn(true)
            checkTokenValidity(jwt)
            //setUserEmail(res.data.email)
            .then((res) => {
                if(res) {
                    setIsLoggedIn(true)
                    setUserEmail(res.email)
                }
            }) 
            .catch(err => console.log(err))
            //checkTokenValidity(jwt)
            //.then((res) => {
                //if(res) {
                    //setIsLoggedIn(true)
                    //setUserEmail(res.data.email)
                //}
            //}) 
        }
      }, []);

    //Переадресация на главную страницу, если пользователь уже залогинен
   
    React.useEffect(() => {
        if (loggedIn) history.push('/');
      }, [loggedIn]);

     //Логин
    function handleLogin(data) {
        if (!data.email || !data.password){
            return;
          }
        login(data)
          .then((res) => { 
            if (!res) throw new Error('Неправильные имя пользователя или пароль');
            if (res) {
            localStorage.setItem('jwt', res.token);
            setUserEmail(data.email)
            setIsLoggedIn(true);
            }
            })
            .catch((err) => (console.log(err)))
     }
    
    //Логаут
    function handleLogout() {
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
    }
    
    //Регистрация
    function handleRegister(data) {
        register(data)
            .then((res) => {
            if(res._id) {
                setIsRegistrationSuccessful(true)
                history.push('/signin')
                }
            })
            .catch(() => {setIsRegistrationSuccessful(false)})
            .finally(() => {setIsInfoToolOpen(true)})
    }
    //задания стейта юзера при монтировании
        const [currentUser, setCurrentUser] = React.useState([]);
        React.useEffect(() => {
            if(loggedIn) {
                api.getUserData()
                .then((res)=> {
                    setCurrentUser(res)
                })
                .catch(err => console.log(err));
            }
          }, 
          [loggedIn]);
    //Карточки
    const [cards, renderCards] = React.useState([]);

    React.useEffect(() => {
    if(loggedIn) {
        api.getInitialCards()
        .then((res)=> {
            renderCards(res)
        })
        .catch(err => console.log(err));
    }
    }, [loggedIn]);

    //Функция лайков 
    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i === currentUser._id);
        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, isLiked)
        .then((newCard) => {
            renderCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch(err => console.log(err))
        }
    //Удаление карточки
    function handleCardDelete(card) {
        api.deleteCard(card._id)
        .then(() => {
            renderCards((state) => state.filter((c) => c._id !== card._id))
        })
        .catch(err => console.log(err))
    }
    //Добавление карточки
    function handleAddPlaceSubmit(data) {
        api.addCard(data)
        .then((newCard)=>{
            renderCards([newCard, ...cards]);
            closeAllPopups() 
        })
        .catch(err => console.log(err));
    }
    //Функция удаления при нажатии на Escape
    useEffect(() => {
        const closeByEscape = (e) => {
          if (e.key === 'Escape') {
            closeAllPopups();
          }
        }
        document.addEventListener('keydown', closeByEscape)
        //!!clean up функция через return
        return () => document.removeEventListener('keydown', closeByEscape)
    }, [])

  return (
    <CurrentUserContext.Provider value={currentUser}>
        {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
        <Switch>
            <Route exact path="/">
            <>
            <div className="page"> 
            <Header headerButtonText="Выйти" onClick={handleLogout}>
            <p>{userEmail}</p>
            </Header>
            <ProtectedRoute 
            exact
            path="/"
            loggedIn={loggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick} 
            onAddPlace={handleAddPlaceClick} 
            onEditAvatar={handleEditAvatarClick} 
            onCardClick={setSelectedCard}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            />
            <Footer />
            </div>
            </>
            </Route>
            <Route path="/signup">
                <Register 
                onRegister={handleRegister}
                />
            </Route>
            <Route path="/signin">
                <Login 
                onLogin={handleLogin}
                />
            </Route>
        </Switch>
        <section className="popups">
            <EditAvatarPopup 
            isOpen={isEditAvatarPopupOpen} 
            onClose={closeAllPopups} 
            onUpdateAvatar={handleUpdateAvatar}
            />
            <AddPlacePopup
            isOpen={isAddPlacePopupOpen} 
            onClose={closeAllPopups} 
            onAddPlace={handleAddPlaceSubmit}
            />
            <EditProfilePopup 
            isOpen={isEditProfilePopupOpen} 
            onClose={closeAllPopups} 
            onUpdateUser={handleUpdateUser}
            />
            <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            />
            <InfoToolTip 
            isOpen={isInfoToolOpen} 
            isRegistrationSuccessful={isRegistrationSuccessful}
            onClose={closeAllPopups} 
            />
            </section>
    </CurrentUserContext.Provider>
  );
}

export default App
