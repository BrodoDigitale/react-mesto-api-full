
  const BASE_URL = 'http://api.mesto.sensi.nomoredomains.rocks';

  //функция проверки ответа от сервера
  const handleResponse = (res) => {
      if (res.ok){ 
        return res.json() 
      } 
      return Promise.reject (`Ошибка: ${res.status}`)
  }
    
   
  const register = (data) => {
    return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      })
    })
    .then(handleResponse)
    .then((res) => {
      return res;
    }) 
  }; 
  
  const login = (data) => {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      })
    })
    .then(handleResponse)
    .then((res) => {
      return res;
    }) 
  }; 

  const checkTokenValidity = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        }
      })
    .then(handleResponse)
    .then((res) => {
        return res;
      }) 
    }

export { BASE_URL, register, login, checkTokenValidity }