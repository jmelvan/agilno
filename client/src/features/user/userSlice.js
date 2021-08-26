import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginError } from '../login/loginSlice';
import { userAPI } from './userAPI';

const initialState = {
  isLoggedIn: false,
};

// login thunk
export const login = createAsyncThunk(
  'users/login',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      return await userAPI.login(params)
    } catch (err) {
      // dispatch login error message if login fails
      dispatch(loginError(err))
      return rejectWithValue();
    }
  }
)

// checkUserLogin thunk
export const checkUserLogin = createAsyncThunk(
  'users/checkUserLogin',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      return await userAPI.checkUserLogin()
    } catch (err) {
      return rejectWithValue();
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    register: (state) => {

    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload: { email, name, surname, saldo, role } }) => {
        state.isLoggedIn = true;
        state.email = email;
        state.name = name;
        state.surname = surname;
        state.balance = saldo;
        state.role = role;
      })
    builder
      .addCase(checkUserLogin.fulfilled, (state, { payload: { email, name, surname, saldo, role } }) => {
        state.isLoggedIn = true;
        state.email = email;
        state.name = name;
        state.surname = surname;
        state.balance = saldo;
        state.role = role;
      })
  },
})

export const { register } = userSlice.actions;

export default userSlice.reducer;