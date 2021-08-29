import helpers from '../../helpers';
import { loginError, registerSuccess, closePopup } from '../login/loginSlice';

export const userAPI = {
  login,
  register,
  checkUserLogin,
  editProfile,
  deposit,
  updateUserInStore,
  getUserBets
}

export { logout };

// function for login
async function login(params, { dispatch, rejectWithValue }) {
  try {
    var response = await helpers.buildRequest(params, '/user/login', false);
    // after successful login, close login popup
    localStorage.setItem('user', JSON.stringify(response));
    dispatch(closePopup());
    return response;
  } catch (err) {
    // dispatch login error message if login fails
    dispatch(loginError(err))
    return rejectWithValue();
  }
}

// function for registration
async function register(params, { dispatch, rejectWithValue }) {
  try {
    var response = await helpers.buildRequest(params, '/user/signup', false);
    // dispatch register success message if register success
    dispatch(registerSuccess(response));
    return response;
  } catch (err) {
    // dispatch login error message if register fails
    dispatch(loginError(err))
    return rejectWithValue();
  }
}

async function updateUserInStore(params, { rejectWithValue }) {
  try {
    var response = await helpers.buildRequest(params, '/user/current', true);
    // update local storage with refreshed user data
    localStorage.setItem('user', JSON.stringify(response));
    return response;
  } catch (err) {
    return rejectWithValue();
  }
}

// function to edit name and surname
function editProfile(params) {
  return new Promise((resolve, reject) => {
    helpers.buildRequest(params, '/user/edit-profile', true).then(res => resolve(res)).catch(err => reject(err));
  })
}

// function for deposit
function deposit(params) {
  return new Promise((resolve, reject) => {
    helpers.buildRequest(params, '/user/deposit', true).then(res => resolve(res)).catch(err => reject(err));
  })
}

// function to check if user is logged in after refresh
async function checkUserLogin(params, { rejectWithValue }) {
  try {
    return await helpers.loadFromStorage('user');
  } catch (err) {
    return rejectWithValue();
  }
}

// function to get user bets
async function getUserBets(params, { rejectWithValue }) {
  try {
    return await helpers.getBets();
  } catch (err) {
    return rejectWithValue();
  }
}

// function for logout
function logout() {
  // remove user from storage
  localStorage.removeItem('user'); 
  // reload page to reset redux state
  window.location.reload(); 
}