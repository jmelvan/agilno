import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventsAPI } from './eventsAPI';

const initialState = {
  sports: undefined,
  bets: {},
  events: undefined
};

// get events thunk
export const getEvents = createAsyncThunk('events/get', eventsAPI.get);

// get all events thunk
export const getAllEvents = createAsyncThunk('events/get-all', eventsAPI.getAll);

// delete events thunk
export const deleteEvent = createAsyncThunk('events/delete', eventsAPI.deleteEvent);

// delete events thunk
export const addEvent = createAsyncThunk('events/add', eventsAPI.add);

// finis one event thunk
export const finishOne = createAsyncThunk('events/finish', eventsAPI.finishOne);

// finis all events thunk
export const finishAll = createAsyncThunk('events/finish-all', eventsAPI.finishAll);

// place bet thunk
export const placeBet = createAsyncThunk('user/place-bet', eventsAPI.placeBet);

// cashout thunk
export const cashout = createAsyncThunk('user/cashout', eventsAPI.cashout);

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    toggleBet: (state, { payload: { event, odd } }) => {
      if(state.bets[odd.event_id] && state.bets[odd.event_id].odd.type == odd.type)
        delete state.bets[odd.event_id];
      else {
        state.bets[odd.event_id] = {};
        state.bets[odd.event_id] = { event: event, odd: odd };
      }
    },
    removeBet: (state, { payload: { event_id } }) => {
      delete state.bets[event_id];
    },
    removeAllBets: (state) => {
      state.bets = {};
    },
    setBetStake: (state, { payload: { event_id, stake } }) => {
      state.bets[event_id].stake = stake;
    },
    setBetslipError: (state, { payload }) => {
      state.placeBetError = payload;
    },
    removeBetslipError: (state) => {
      state.placeBetError = undefined;
    },
    removeBetslipSuccess: (state) => {
      state.placeBetSuccess = undefined;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getEvents.fulfilled, (state, { payload }) => {
      state.sports = payload;
    })
    builder.addCase(getAllEvents.fulfilled, (state, { payload }) => {
      state.events = payload;
    })
    builder.addCase(placeBet.fulfilled, (state, { payload: { msg } }) => {
      state.placeBetSuccess = msg;
      state.placeBetError = undefined;
    }).addCase(placeBet.rejected, (state, { payload: { error } }) => {
      state.placeBetError = error;
      state.placeBetSuccess = undefined;
    })
  }
})

export const { 
  toggleBet, 
  removeBet, 
  removeAllBets, 
  setBetStake, 
  setBetslipError, 
  removeBetslipError, 
  removeBetslipSuccess 
} = eventsSlice.actions;

export default eventsSlice.reducer;