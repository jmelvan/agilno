import helpers from '../../helpers';

export const eventsAPI = {
  get
}

// function to get all unfinished events
async function get(params, { rejectWithValue }) {
  try {
    return await helpers.getSports();
  } catch (err) {
    return rejectWithValue();
  }
}
