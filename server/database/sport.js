const { pool } = require('./connect');
const { error } = require('../config');

// function to get all sports
var get = (req, res) => {
  pool.query('SELECT * FROM sport', (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  })
}

// function to check if sport with the same name exists
var checkUnique = (req, res, next) => {
  const { body: { query: { name } } } = req;

  pool.query('SELECT count(*) FROM sport WHERE name=$1', [name], (err, result) => {
    if (err) throw err;
    if (result.rowCount) return res.status(422).json({ error: error.sport_exists }); // if rowCount > 0, sport exists and return error for creation
    next();
  })
}

// function to add new sport
var add = (req, res) => {
  const { body: { query: { name, type, result } } } = req;

  pool.query('INSERT INTO sport(name, type, result) VALUES ($1, $2, $3)', [name, type, result], (error, result) => {
    if (error) throw error;
    res.sendStatus(201);
  })
}

// function to delete existing sport
var remove = (req, res) => {
  const { body: { query: { name } } } = req;

  pool.query('DELETE FROM sport WHERE name=$1', [name], (error, result) => {
    if (error) throw error;
    res.sendStatus(200);
  })
}

module.exports = { add, checkUnique, remove, get }