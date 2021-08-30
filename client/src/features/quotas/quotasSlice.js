import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quotasAPI } from './quotasAPI';

const initialState = {
  quotas: undefined
};

// get quotas thunk
export const getQuotas = createAsyncThunk('quota/get', quotasAPI.get);

// delete quota thunk
export const deleteQuota = createAsyncThunk('quota/delete', quotasAPI.deleteQuota);

// add quota thunk
export const addQuota = createAsyncThunk('quota/add', quotasAPI.addQuota);

export const quotasSlice = createSlice({
  name: 'quotas',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getQuotas.fulfilled, (state, { payload }) => {
      state.quotas = payload;
    })
  }
})

export default quotasSlice.reducer;