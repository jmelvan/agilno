import axios from 'axios';
import config from '../config';

// function to build request to rest API
const buildRequest = (params, action, auth) => {
  return new Promise((resolve, reject) =>{
    var data = { query: params }, options = {}; // build query
    auth && (options.headers = authHeader()); // if auth true, set auth header
    // post request
    axios.post(config.api + action, data, options)
      .then(response => {
        // resolve at the end
        resolve(response.data);
      })
      .catch(err => reject(err.response.data)) // if error, reject error message sent from server
  })
}

// function to return authorization header with jwt token
const authHeader = () => {
  // get user from localStorage
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token)
    return { 'Authorization': 'Bearer ' + user.token };
  else
    return {};
}

const balanceFormatter = (balance) => {
  var formatter = new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'HRK',
  });

  return formatter.format(balance);
}

// function to update store changes to local storage
const updateLocalStorage = (key, values) => {
  // load old value first
  loadFromStorage(key).then(item => {
    item = JSON.parse(item); // parse old value
    // loop through new value keys
    Object.keys(values).map(item_key => {
      item[item_key] = values[item_key]; // for every changed value key, set new value
    })
    // save new values back to local storage under same key
    localStorage.setItem(key, item);
  })
}

const loadFromStorage = (key) => {
  return new Promise((resolve, reject) => {
    var item = localStorage.getItem(key);
    item ? resolve(JSON.parse(item)) : reject();
  })
}

const popupMsg = (type, msg) => {
  return <div className={"popup__" + type}>{msg}</div>
}

const helpers = {
  buildRequest,
  balanceFormatter,
  updateLocalStorage,
  loadFromStorage,
  authHeader,
  popupMsg
}

export default helpers;