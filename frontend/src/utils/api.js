class Api {
    constructor(config) {
      // тело конструктора
      this._url = config.url;
      this._headers = config.headers
    }
  
    getInitialCards() {
        return fetch(`${this._url}/cards`,{
            method: 'GET',
            headers: this._headers
        })
        .then(this._handleResponse)
     }
     getUserData() {
        return fetch(`${this._url}/users/me`,{
            method: 'GET',
            headers: this._headers
        })
        .then(this._handleResponse)
     }
     updateUserData(data) {
      return fetch(`${this._url}/users/me`,{
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about,
        })
    })
    .then(this._handleResponse)
     }
     updateAvatar(newLink) {
      return fetch(`${this._url}/users/me/avatar`,{
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: newLink
        })
      })
      .then(this._handleResponse)
     }
     addCard(data) {
       return fetch( `${this._url}/cards`, {
         method: 'POST',
         headers: this._headers,
         body: JSON.stringify({
         name: data.name,
         link: data.link,
         })
       })
       .then(this._handleResponse)
     }
    deleteCard(id) {
      return fetch(`${this._url}/cards/${id}`,{
        method: 'DELETE',
        headers: this._headers
    })
    .then(this._handleResponse)
    }
    _handleResponse(res) {
     if(res.ok) {
       return res.json()
     }
     return Promise.reject (`Ошибка: ${res.status}`)
    }
     changeLikeCardStatus(id, isLiked) {
      if(!isLiked){
        return fetch(`${this._url}/cards/likes/${id}`,{
          method: 'PUT',
          headers: this._headers
        })
        .then(this._handleResponse)
      } else {
        return fetch(`${this._url}/cards/likes/${id}`,{
          method: 'DELETE',
          headers: this._headers
        })
        .then(this._handleResponse)
        }
      } 
  }
  
//Создание api
export const api = new Api({
    url: 'https://mesto.nomoreparties.co/v1/cohort-26',
    headers: {
        "authorization": "ff36f33a-78de-4788-b2e8-96f517dc0490",
        "Content-Type": "application/json"
    }
  })