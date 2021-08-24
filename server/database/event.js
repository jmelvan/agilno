
const { pool } = require('./connect');
const { error, long_queries } = require('../config');

// function to get all unfinished events
var get = (req, res) => {
  pool.query(long_queries.events.get_query, (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  })
}

// function to get all unfinished events by sport name
var getBySport = (req, res) => {
  // query that returns (host, host_img, guest, guest_img, start_time, competition_name, competition_type) for events with condition that filters sport names
  var query = long_queries.events.get_query + ' AND competition.sport_name=$1';
  pool.query(query, [req.params.sport_name], (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  })
}

// function to check if event with the same host and guest on the same time already exist
var checkUnique = (req, res, next) => {
  const { body: { query: { host_id, guest_id, start_time } } } = req;

  pool.query('SELECT * FROM event WHERE host_id=$1 AND guest_id=$2 AND start_time=$3', [host_id, guest_id, start_time], (err, result) => {
    if (err) console.log(err);
    if (result.rowCount) return res.status(422).json({ error: error.competition_exists }); // if rowCount > 0, event exists and return error for creation
    next();
  })
}

// function to add new player
var add = (req, res) => {
  const { body: { query: { host_id, guest_id, start_time, competition_id } } } = req;

  pool.query('INSERT INTO event(host_id, guest_id, start_time, competition_id) VALUES ($1, $2, $3, $4)', [host_id, guest_id, start_time, competition_id], (error, result) => {
    if (error) throw error;
    res.sendStatus(201);
  })
}

// function to delete existing player
var remove = (req, res) => {
  const { body: { query: { id } } } = req;

  pool.query('DELETE FROM event WHERE id=$1', [id], (error, result) => {
    if (error) throw error;
    res.sendStatus(200);
  })
}

var finishAllEvents = (req, res) => {
  var end_time = new Date(); // set current time as end time
  
  pool.query('UPDATE event SET end_time=$1 WHERE end_time IS NULL', [end_time.getTime()], (error, result) => {
    if (error) throw error;
    res.sendStatus(200);
  })
}


module.exports = { get, getBySport, checkUnique, add, remove, finishAllEvents };