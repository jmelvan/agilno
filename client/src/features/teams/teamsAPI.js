import axios from 'axios';
import config from '../../config';
import helpers from '../../helpers';

export const teamsAPI = {
  get,
  deleteTeam,
  addTeam
}

// function to get all quotas for admin dashboard
async function get(params, { rejectWithValue }) {
  try {
    var resp = await axios.get(config.api + '/sport/teams/all', helpers.authHeader());
    return resp.data;
  } catch (err) {
    return rejectWithValue();
  }
}

// function to add quota
async function addTeam(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/sport/' + params.sport_name + '/teams/add', true);
  } catch (err) {
    alert(err.error);
    return rejectWithValue(err);
  }
}

// function to delete quota
async function deleteTeam(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/sport/teams/remove', true);
  } catch (err) {
    return rejectWithValue();
  }
}