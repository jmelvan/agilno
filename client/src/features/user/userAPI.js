import axios from 'axios';
import config from '../../config';
import helpers from '../../helpers';

export const userAPI = {
  login,
  register,
  checkUserLogin
}

export { logout };

// function for login
function login(params) {
  return new Promise((resolve, reject) =>{
    var data = helpers.buildQuery(params); // build query for request
    
    axios.post(config.api+'/user/login', data)
      .then(response => {
        // if login successful, store user data
        localStorage.setItem('user', JSON.stringify(response.data));
        // resolve at the end
        resolve(response.data);
      })
      .catch(err => reject(err.response.data)) // if error, reject error message sent from server
  });
}

// function to check if user is logged in after refresh
function checkUserLogin() {
  return new Promise((resolve, reject) =>{
    // try to load user from storage
    helpers.loadFromStorage('user').then(user => {
      resolve(JSON.parse(user)); // if loaded resolve, else reject
    }).catch(() => reject())
  });
}

function logout() {
  localStorage.removeItem('user');
  window.location.reload();
}

function register() {
  
}