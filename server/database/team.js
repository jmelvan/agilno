const { pool } = require('./connect');
const { error } = require('../config');

// function to get all teams
var getAll = (req, res) => {
  pool.query('SELECT * FROM team', (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  })
}

// function to get teams playing selected sports
var getBySport = (req, res) => {
  pool.query('SELECT * FROM team WHERE sport_name=$1', [req.params.sport_name], (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  })
}

// function to check if team with the same name exists
var checkUnique = (req, res, next) => {
  const { body: { query: { name } } } = req;

  pool.query('SELECT * FROM team WHERE name=$1', [name], (err, result) => {
    if (err) throw err;
    if (result.rowCount) return res.status(422).json({ error: error.team_exists }); // if rowCount > 0, team exists and return error for creation
    next();
  })
}

// function to add new team
var add = (req, res) => {
  const { body: { query: { name, type, img, country } } } = req;

  pool.query('INSERT INTO team(name, type, img, sport_name, country) VALUES ($1, $2, $3, $4, $5)', [name, type, img, req.params.sport_name, country || name], (error, result) => {
    if (error) throw error;
    res.sendStatus(201);
  })
}

// function to delete existing team
var remove = (req, res) => {
  const { body: { query: { id } } } = req;

  pool.query('DELETE FROM team WHERE id=$1', [id], (error, result) => {
    if (error) throw error;
    res.sendStatus(200);
  })
}

module.exports = { getAll, getBySport, checkUnique, add, remove };