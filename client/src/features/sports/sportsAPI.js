import axios from 'axios';
import config from '../../config';
import helpers from '../../helpers';

export const sportsAPI = {
  get,
  deleteSport,
  addSport
}

// function to get all sports for admin dashboard
async function get(params, { rejectWithValue }) {
  try {
    var resp = await axios.get(config.api + '/sport', helpers.authHeader());
    return resp.data;
  } catch (err) {
    return rejectWithValue();
  }
}

// function to delete sport
async function addSport(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/sport/add', true);
  } catch (err) {
    alert(err.error);
    return rejectWithValue();
  }
}

// function to delete sport
async function deleteSport(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/sport/remove', true);
  } catch (err) {
    return rejectWithValue();
  }
}