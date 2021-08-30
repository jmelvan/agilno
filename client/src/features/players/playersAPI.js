import axios from 'axios';
import config from '../../config';
import helpers from '../../helpers';

export const playersAPI = {
  get,
  deletePlayer,
  addPlayer
}

// function to get all quotas for admin dashboard
async function get(params, { rejectWithValue }) {
  try {
    var resp = await axios.get(config.api + '/player', helpers.authHeader());
    return resp.data;
  } catch (err) {
    return rejectWithValue();
  }
}

// function to add quota
async function addPlayer(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/player/add', true);
  } catch (err) {
    alert(err.error);
    return rejectWithValue(err);
  }
}

// function to delete quota
async function deletePlayer(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/player/remove', true);
  } catch (err) {
    return rejectWithValue();
  }
}