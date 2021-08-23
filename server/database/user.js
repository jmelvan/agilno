const { pool } = require('./connect');
const crypto = require('crypto');

// function to get user by email
var getUser = (email) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM public."user" WHERE email=$1', [email], (error, result) => {
      if (error) reject(error);
      resolve(result.rows);
    })
  })
}

// function to create a new user
var createUser = (email, password) => {
  return new Promise((resolve, reject) => {
    // create hash with random salt and password for new user
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    // create hash for url validation
    var validate_hash = crypto.randomBytes(32).toString('hex');

    pool.query('INSERT INTO public."user"(email, hash, salt, validate_hash) VALUES ($1, $2, $3, $4)', [email, hash, salt, validate_hash], (error, result) => {
      if (error) reject(error);
      resolve();
    })
  }) 
}

// function to validate new user
var validateUser = (req, res, next) => {
  // update field validate to true if user with specific hash exists
  pool.query('UPDATE public."user" SET validate=$1 WHERE validate_hash=$2', [true, req.params.hash], (error) => {
    if (error) return res.sendStatus(422);
    res.sendStatus(200);
  })
}

module.exports = { getUser, createUser, validateUser };