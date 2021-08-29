const { pool } = require('./connect');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { error, secrets, successMsg, long_queries } = require('../config');
const betslip = require('./betslip');

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

// function to handle sign up request (check if user exist, if not, create use)
const handleSignUp = (req, res) => {
  //request database to see if email exists
  getUser(req.body.query.email).then(result => {
    // if user with given email is found, return error to client that email is already in use
    res.status(422).json({error: error.email_exists});
  }).catch((e) => {
    // cahtches reject error if no rows found in database (meaning that user with that email doesn't exist, so we can create new one)
    e && createUser(req.body.query.email, req.body.query.password).then(() => res.status(201).json({ msg: successMsg.register }));
  });
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
  getUser(req.body.query.email).then(result => {
    // create hash with saved salt for user, and entered password
    const hash = crypto.pbkdf2Sync(req.body.query.password, result.salt, 10000, 512, 'sha512').toString('hex');
    if (result.hash != hash) return res.status(401).json({ error: error.validate_password }); // return error if hashes don't match
    // if hashes match, save user to request, pass validation
    req.user = result;
    next();
  }).catch(e => {
    e && res.status(401).json({ error: error.validate_password }); // if no results, return error
  })
}

// function to handle login request (return jwt token)
const handleLogin = (req, res) => {
  const { user: { email, name, surname, saldo, role } } = req
  // user object is filtered because we don't want to send hash and salt to client
  res.json({ token: signJWT(req.user), email: email, name: name, surname: surname, saldo: saldo, role: role })
};

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
  getUser(req.payload.email).then(user => {req.user = user; next();});
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
  const { body: { query }, payload: { email } } = req;

  pool.query('UPDATE public."user" SET name=$1, surname=$2 WHERE email=$3', [query.newName || query.name, query.newSurname || query.surname, email], (error) => {
    if (error) return res.sendStatus(422);
    res.status(200).json({ msg: successMsg.editProfile });
  })
}

// function to deposit money
var deposit = (req, res) => {
  const { body: { query: { card_number, card_expire, card_cvv, amount } }, payload: { email } } = req;
  // check if credit card is valid (for simulation only this card works)
  if(card_number != '5524508617228117' && card_expire != '05/26' && card_cvv != '280') return res.status(422).json({ error: error.credit_card });

  // get current user saldo (get from database because if we get it from request we don't want someone to intercept request and send not valid current saldo)
  getUser(email).then(response => {
    var new_saldo = parseFloat(response.saldo) + parseFloat(amount); // add new amount to current saldo

    // update new saldo in db
    pool.query('UPDATE public."user" SET saldo=$1 WHERE email=$2', [new_saldo, email], (error) => {
      if (error) return res.sendStatus(422);
      res.status(200).json({ msg: successMsg.deposit });
    })
  })
}

// function to place bet (function proccess the request and redirect to another function based on bet type)
var placeBet = (req, res, next) => {
  const { body: { query: { type, quotas, stake } }, payload: { email } } = req;
  var promises = []; // variable to store promises for each bet

  // first, create betslip where single bets would be stored
  betslip.createBetslip(email, stake || null, type).then(betslip_id => {
    // loop through quotas and create bet for each quota
    for(let quota of quotas)
      promises.push(
        betslip.createBetslipBet(betslip_id, quota).catch(() => res.status(422).json({ error: error.invalid_bet })) // if error on placing bet, reject whole operation
      );
    // after all bets are created (fulfill promises), return success
    Promise.all(promises).then(() => next());
  })
}

// function to take user money after placing bet
var takeMoneyFromUser = (req, res) => {
  const { user: { saldo }, payload: { email }, body: { query: { stake } } } = req;
  // calculate new user balance
  var newBalance = parseFloat(saldo) - parseFloat(stake);
  // update user saldo in db
  pool.query('UPDATE public."user" SET saldo=$1 WHERE email=$2', [newBalance, email], (err, resp) => {
    if (err) throw err;
    res.status(201).json({ msg: successMsg.placeBet })
  })
}

// function to get user bets
var getBets = (req, res) => {
  const { payload: { email } } = req;

  pool.query(long_queries.user.get_bets, [email], (err, result) => {
    if (err) throw err;
    res.json(result.rows);
  })
}

module.exports = { 
  getUser,
  handleSignUp, 
  validateUser, 
  isUserValidated, 
  validatePassword, 
  handleLogin, 
  attachUserData,
  changePersonalData, 
  deposit, 
  isUserAdmin,
  placeBet,
  takeMoneyFromUser,
  getBets
};