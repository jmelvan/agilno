const { pool } = require('./connect');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { error, secrets } = require('../config');

// function to get user by email
var getUser = (email) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT name, surname, email, hash, salt, saldo, validated, role FROM public."user" WHERE email=$1 LIMIT 1', [email], (error, result) => {
      if (error) throw error;
      if (result.rowCount == 0) reject(1); // reject if no rows (meaning no user found with given email)
      resolve(result.rows[0]); // resolve only first result, because there will be only one (email is primary key)
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
  pool.query('UPDATE public."user" SET validated=$1 WHERE validate_hash=$2', [true, req.params.hash], (error) => {
    if (error) return res.sendStatus(422);
    res.sendStatus(200);
  })
}

// function to validate login password and user
var validatePassword = (req, res, next) => {
  // get user by email
  getUser(req.body.email).then(result => {
    // create hash with saved salt for user, and entered password
    const hash = crypto.pbkdf2Sync(req.body.password, result.salt, 10000, 512, 'sha512').toString('hex');
    if (result.hash != hash) return res.status(401).json({ error: error.validate_password }); // return error if hashes don't match
    // if hashes match, save user to request, pass validation
    req.user = result;
    next();
  }).catch(e => {
    e && res.status(401).json({ error: error.validate_password }); // if no results, return error
  })
}

// function to check if user is validated
var isUserValidated = (req, res, next) => {
  if(!req.user.validated) return res.status(422).json({ error: error.user_not_validated });
  next();
}

// function to check if user has admin privilages
var isUserAdmin = (req, res, next) => {
  if(req.user.role != 'admin') return res.status(403).json({ error: error.user_not_admin });
  next();
}

// function to attach user data to request
var attachUserData = (req, res, next) => {
  getUser(req.body.email).then(user => {req.user = user; next();});
}

// function to sign jwt
var signJWT = (user) => {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60); // handle expiration time
  // return signed jwt
  return jwt.sign({
    email: user.email,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, secrets.jwt);
}

// function to change users name and surname
var changePersonalData = (req, res) => {
  const { body: { user } } = req;

  pool.query('UPDATE public."user" SET name=$1, surname=$2 WHERE email=$3', [user.newName || user.name, user.newSurname || user.surname, user.email], (error) => {
    if (error) return res.sendStatus(422);
    res.sendStatus(200);
  })
}

// function to deposit money
var deposit = (req, res) => {
  // get current user saldo (get from database because if we get it from request we don't want someone to intercept request and send not valid current saldo)
  getUser(req.body.email).then(response => {
    var new_saldo = response.saldo + req.body.amount; // add new amount to current saldo
    // update new saldo in db
    pool.query('UPDATE public."user" SET saldo=$1 WHERE email=$2', [new_saldo, req.body.email], (error) => {
      if (error) return res.sendStatus(422);
      res.sendStatus(200);
    })
  })
}

module.exports = { getUser, createUser, validateUser, isUserValidated, validatePassword, attachUserData, signJWT, changePersonalData, deposit, isUserAdmin };