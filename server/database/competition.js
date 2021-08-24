
const { pool } = require('./connect');
const { error } = require('../config');

// function to get all players
var get = (req, res) => {
  pool.query('SELECT * FROM competition', (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  })
}

// function to get all players
var getBySport = (req, res) => {
  // query string builder based on extra url query param 'type' that can be (national, club, individual)
  var query_str = !req.query.type ? 'SELECT * FROM competition WHERE sport_name=$1' : "SELECT * FROM competition WHERE sport_name=$1 AND type='"+req.query.type+"'";
  
  pool.query(query_str, [req.params.sport_name], (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  })
}

// function to check if player with the same data exists (same name and surname are allowed, but only if cuntry or sport_name is different)
var checkUnique = (req, res, next) => {
  const { body: { query: { name, sport_name } } } = req;

  pool.query('SELECT * FROM competition WHERE name=$1 AND sport_name=$2', [name, sport_name], (err, result) => {
    if (err) console.log(err);
    if (result.rowCount) return res.status(422).json({ error: error.competition_exists }); // if rowCount > 0, player exists and return error for creation
    next();
  })
}

// function to add new player
var add = (req, res) => {
  const { body: { query: { name, type, sport_name } } } = req;

  pool.query('INSERT INTO competition(name, type, sport_name) VALUES ($1, $2, $3)', [name, type, sport_name], (error, result) => {
    if (error) throw error;
    res.sendStatus(201);
  })
}

// function to delete existing player
var remove = (req, res) => {
  const { body: { query: { id } } } = req;

  pool.query('DELETE FROM competition WHERE id=$1', [id], (error, result) => {
    if (error) throw error;
    res.sendStatus(200);
  })
}


module.exports = { get, getBySport, checkUnique, add, remove };