import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../features/user/userSlice';
import loginSlice from '../features/login/loginSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    login: loginSlice
  },
});
