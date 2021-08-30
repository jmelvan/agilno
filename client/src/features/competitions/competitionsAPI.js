import axios from 'axios';
import config from '../../config';
import helpers from '../../helpers';

export const competitionsAPI = {
  get,
  deleteCompetition,
  addCompetition
}

// function to get all Competitions for admin dashboard
async function get(params, { rejectWithValue }) {
  try {
    var resp = await axios.get(config.api + '/competition', helpers.authHeader());
    return resp.data;
  } catch (err) {
    return rejectWithValue();
  }
}

// function to delete Competition
async function addCompetition(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/competition/add', true);
  } catch (err) {
    alert(err.error);
    return rejectWithValue();
  }
}

// function to delete Competition
async function deleteCompetition(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/competition/remove', true);
  } catch (err) {
    return rejectWithValue();
  }
}