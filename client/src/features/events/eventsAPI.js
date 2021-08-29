import helpers from '../../helpers';

export const eventsAPI = {
  get,
  placeBet,
  cashout
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

// function to cashout betslip
async function cashout(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/user/cashout', true);
  } catch (err) {
    return rejectWithValue(err);
  }
}