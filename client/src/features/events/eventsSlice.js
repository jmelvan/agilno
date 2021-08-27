import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventsAPI } from './eventsAPI';

const initialState = {
  sports: undefined,
  odds: undefined
};

// get events thunk
export const getEvents = createAsyncThunk('events/get', eventsAPI.get);

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(getEvents.fulfilled, (state, { payload }) => {
      state.sports = payload;
    })
  }
})

export const {  } = eventsSlice.actions;

export default eventsSlice.reducer;