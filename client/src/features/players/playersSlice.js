import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { playersAPI } from './playersAPI';

const initialState = {
  players: undefined
};

// get players thunk
export const getPlayers = createAsyncThunk('player/get', playersAPI.get);

// delete player thunk
export const deletePlayer = createAsyncThunk('player/delete', playersAPI.deletePlayer);

// add player thunk
export const addPlayer = createAsyncThunk('player/add', playersAPI.addPlayer);

export const playersSlice = createSlice({
  name: 'players',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getPlayers.fulfilled, (state, { payload }) => {
      state.players = payload;
    })
  }
})

export default playersSlice.reducer;