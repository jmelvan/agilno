import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../features/user/userSlice';
import loginSlice from '../features/login/loginSlice';
import eventsSlice from '../features/events/eventsSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    login: loginSlice,
    events: eventsSlice
  },
});
