import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: undefined
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {

  }
})

export const {  } = eventsSlice.actions;

export default eventsSlice.reducer;