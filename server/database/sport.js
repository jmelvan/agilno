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
  pool.query('SELECT * FROM sport WHERE name=$1', [req.body.name], (err, result) => {
    if (err) throw err;
    if (result.rowCount) return res.status(422).json({ error: error.sport_exists }); // if rowCount > 0, sport exists and return error for creation
    next();
  })
}

// function to add new sport
var add = (req, res) => {
  pool.query('INSERT INTO sport(name, type) VALUES ($1, $2)', [req.body.name, req.body.type], (error, result) => {
    if (error) throw error;
    res.sendStatus(201);
  })
}

// function to delete existing sport
var remove = (req, res) => {
  pool.query('DELETE FROM sport WHERE name=$1', [req.body.name], (error, result) => {
    if (error) throw error;
    res.sendStatus(200);
  })
}

module.exports = { add, remove, get, checkUnique }