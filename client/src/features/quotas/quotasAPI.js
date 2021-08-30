import axios from 'axios';
import config from '../../config';
import helpers from '../../helpers';

export const quotasAPI = {
  get,
  deleteQuota,
  addQuota
}

// function to get all quotas for admin dashboard
async function get(params, { rejectWithValue }) {
  try {
    var resp = await axios.get(config.api + '/event/all-quotas', helpers.authHeader());
    return resp.data;
  } catch (err) {
    return rejectWithValue();
  }
}

// function to add quota
async function addQuota(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/event/' + params.event_id + '/quotas/add', true);
  } catch (err) {
    alert(err.error);
    return rejectWithValue(err);
  }
}

// function to delete quota
async function deleteQuota(params, { rejectWithValue }) {
  try {
    return await helpers.buildRequest(params, '/event/quotas/remove', true);
  } catch (err) {
    return rejectWithValue();
  }
}