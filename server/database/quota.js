const { pool } = require('./connect');
const { error, long_queries } = require('../config');

// function to get all quotas for all unfinished events
var get = (req, res) => {
  pool.query('SELECT quota.id, event_id, type, value from quota LEFT JOIN event ON event_id=event.id WHERE event.end_time IS NULL', (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  })
}

// function to get all quotas
var getAll = (req, res) => {
  pool.query(long_queries.quotas.get_all, (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  })
}

// function to get all odds for selected event
var getByEvent = (req, res) => {
  pool.query('SELECT * FROM quota WHERE event_id=$1', [req.params.event_id], (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  })
}

// function to check if quota with the same type for the same event already exist
var checkUnique = (req, res, next) => {
  const { body: { query: { type } } } = req;

  pool.query('SELECT * FROM quota WHERE type=$1 AND event_id=$2', [type, req.params.event_id], (err, result) => {
    if (err) console.log(err);
    if (result.rowCount) return res.status(422).json({ error: error.quota_exists }); // if rowCount > 0, quota exists and return error for creation
    next();
  })
}

// function to add new quota
var add = (req, res) => {
  const { body: { query: { type, value } } } = req;

  pool.query('INSERT INTO quota(type, value, event_id) VALUES ($1, $2, $3)', [type, value, req.params.event_id], (error, result) => {
    if (error) throw error;
    res.sendStatus(201);
  })
}

// function to delete existing quota
var remove = (req, res) => {
  const { body: { query: { id } } } = req;

  pool.query('DELETE FROM quota WHERE id=$1', [id], (error, result) => {
    if (error) throw error;
    res.sendStatus(200);
  })
}

module.exports = { get, getAll, getByEvent, checkUnique, add, remove };