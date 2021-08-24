
const { pool } = require('./connect');
const { error } = require('../config');

// function to get all players
var get = (req, res) => {
  pool.query('SELECT * FROM player', (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  })
}

// function to get all players
var getBySport = (req, res) => {
  pool.query('SELECT * FROM player WHERE sport_name=$1', [req.param.sport_name], (error, result) => {
    if (error) throw error;
    res.json(result.rows);
  })
}

// function to check if player with the same data exists (same name and surname are allowed, but only if cuntry or sport_name is different)
var checkUnique = (req, res, next) => {
  const { body: { query: { name, surname, sport_name, country } } } = req;

  pool.query('SELECT * FROM player WHERE name=$1 AND surname=$2 AND sport_name=$3 AND country=$4', [name, surname, sport_name, country], (err, result) => {
    if (err) console.log(err);
    if (result.rowCount) return res.status(422).json({ error: error.player_exists }); // if rowCount > 0, player exists and return error for creation
    next();
  })
}

// function to add new player
var add = (req, res) => {
  const { body: { query: { name, surname, team_id, sport_name, country } } } = req;

  pool.query('INSERT INTO player(name, surname, team_id, sport_name, country) VALUES ($1, $2, $3, $4, $5)', [name, surname, team_id, sport_name, country], (error, result) => {
    if (error) throw error;
    res.sendStatus(201);
  })
}

// function to delete existing player
var remove = (req, res) => {
  const { body: { query: { id } } } = req;
  helpers.removeQueryBuilder('player', 'id', id);
}

// function to asign player to the team
var asignToTeam = (req, res) => {
  const { body: { query: { player_id, team_id } } } = req;

  pool.query('UPDATE player SET team_id=$1 WHERE id=$2', [team_id, player_id], (error) => {
    if (error) return res.sendStatus(422);
    res.sendStatus(200);
  })
}

module.exports = { get, getBySport, checkUnique, add, remove, asignToTeam };