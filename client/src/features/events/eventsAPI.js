import helpers from '../../helpers';

export const eventsAPI = {
  get,
  placeBet
}

// function to get all unfinished events
async function get(params, { rejectWithValue }) {
  try {
    return await helpers.getSports();
  } catch (err) {
    return rejectWithValue();
  }
}

// function to place bet
async function placeBet(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/user/place-bet', true);
  } catch (err) {
    return rejectWithValue(err);
  }
}