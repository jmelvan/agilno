import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sportsAPI } from './sportsAPI';

const initialState = {
  sports: undefined
};

// get sports thunk
export const getSports = createAsyncThunk('sports/get', sportsAPI.get);

// delete sport thunk
export const deleteSport = createAsyncThunk('sports/delete', sportsAPI.deleteSport);

// add sport thunk
export const addSport = createAsyncThunk('sports/add', sportsAPI.addSport);

export const sportsSlice = createSlice({
  name: 'sports',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getSports.fulfilled, (state, { payload }) => {
      state.sports = payload;
    })
  }
})

export default sportsSlice.reducer;