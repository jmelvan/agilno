import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teamsAPI } from './teamsAPI';

const initialState = {
  teams: undefined
};

// get teams thunk
export const getTeams = createAsyncThunk('team/get', teamsAPI.get);

// delete team thunk
export const deleteTeam = createAsyncThunk('team/delete', teamsAPI.deleteTeam);

// add team thunk
export const addTeam = createAsyncThunk('team/add', teamsAPI.addTeam);

export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getTeams.fulfilled, (state, { payload }) => {
      state.teams = payload;
    })
  }
})

export default teamsSlice.reducer;