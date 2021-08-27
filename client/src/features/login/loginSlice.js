import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openPopup: false,
  isRegistered: true,
  errorMsg: undefined,
  successMsg: undefined
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    openPopup: (state) => {
      state.openPopup = true;
    },
    closePopup: (state) => {
      state.openPopup = false;
      state.isRegistered =  true;
      state.errorMsg = false;
    },
    toggleRegister: (state) => {
      state.isRegistered = !state.isRegistered;
    },
    loginError: (state, { payload: { error } }) => {
      state.errorMsg = error;
      state.successMsg = undefined;
    },
    registerSuccess: (state, { payload: { msg } }) => {
      state.successMsg = msg;
      state.errorMsg = undefined;
      state.isRegistered = !state.isRegistered;
    }
  }
})

export const { openPopup, closePopup, toggleRegister, loginError, registerSuccess } = loginSlice.actions;

export default loginSlice.reducer;