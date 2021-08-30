import helpers from '../../helpers';
import axios from 'axios';
import config from '../../config';

export const eventsAPI = {
  get,
  add,
  getAll,
  placeBet,
  deleteEvent,
  finishOne,
  finishAll,
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

// function to get all events for admin
async function getAll(params, { rejectWithValue }) {
  try {
    var resp = await axios.get(config.api + '/event/get-all', helpers.authHeader());
    return resp.data;
  } catch (err) {
    return rejectWithValue();
  }
}

// function to add event 
async function add(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/event/add', true);
  } catch (err) {
    alert(err.error);
    return rejectWithValue();
  }
}

// function to delete event (for admin)
async function deleteEvent(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/event/remove', true);
  } catch (err) {
    return rejectWithValue();
  }
}

// function to finish one event
async function finishOne(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/event/finish', true);
  } catch (err) {
    return rejectWithValue();
  }
}

// function to finish all events
async function finishAll(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/event/finish-all', true);
  } catch (err) {
    return rejectWithValue();
  }
}

// function to place bet
async function placeBet(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/user/place-bet', true);
  } catch (err) {
    alert(err.error);
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