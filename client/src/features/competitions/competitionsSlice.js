import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { competitionsAPI } from './competitionsAPI';

const initialState = {
  competitions: undefined
};

// get competitions thunk
export const getCompetitions = createAsyncThunk('competition/get', competitionsAPI.get);

// delete competition thunk
export const deleteCompetition = createAsyncThunk('competition/delete', competitionsAPI.deleteCompetition);

// add competition thunk
export const addCompetition = createAsyncThunk('competition/add', competitionsAPI.addCompetition);

export const competitionsSlice = createSlice({
  name: 'competitions',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getCompetitions.fulfilled, (state, { payload }) => {
      state.competitions = payload;
    })
  }
})

export default competitionsSlice.reducer;