const { pool } = require('./connect');
const { error } = require('../config');

var get = (req, res) => {
  res.send(req.params.sport_name)
}

module.exports = { get }