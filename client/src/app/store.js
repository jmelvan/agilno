import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../features/user/userSlice';
import loginSlice from '../features/login/loginSlice';
import eventsSlice from '../features/events/eventsSlice';
import sportsSlice from '../features/sports/sportsSlice';
import competitionsSlice from '../features/competitions/competitionsSlice';
import quotasSlice from '../features/quotas/quotasSlice';
import teamsSlice from '../features/teams/teamsSlice';
import playersSlice from '../features/players/playersSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    login: loginSlice,
    events: eventsSlice,
    sports: sportsSlice,
    competitions: competitionsSlice,
    quotas: quotasSlice,
    teams: teamsSlice,
    players: playersSlice
  },
});
