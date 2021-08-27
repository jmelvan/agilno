const { pool } = require('./connect');
const { error, long_queries } = require('../config');

// function to create betslip for user, function returns created betslip's id
const createBetslip = (email, stake, type) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO betslip(user_email, stake, type) VALUES ($1, $2, $3) RETURNING id', [email, stake, type], (error, result) => {
      if (error) reject(error);
      resolve(result.rows[0].id); // resolve created id
    })
  })
}

// function to create user bet and match it with betslip
const createBetslipBet = (betslip_id, quota) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO betslip_bet(betslip_id, quota_id, stake) VALUES ($1, $2, $3)', [betslip_id, quota.id, quota.stake], (error, result) => {
      if (error) reject(0);
      resolve(1);
    })
  })
}

// function to process bets after events are finished
const processBets = (req, res) => {
  var promises = []; // create array of promises for 2 functions that must be executed

  promises.push(handleResultsInMultiple()); // handle results in multiple betslips
  promises.push(handleResultsInSingle()); // handle results in single betslips
  // after all functions executes successfully, send response to client
  Promise.all(promises).then(() => res.sendStatus(200));
}

// function to handle results in multiple betslips
const handleResultsInMultiple = () => {
  return new Promise((resolve, reject) => {
    // query that returns all unprocessed betslips
    pool.query(long_queries.betslip.wins_in_multiple, (error, result) => {
      if (error) reject(0);
      // devide unprocessed betslips on winners and lossers
      var win_betslips = [], loss_betslips = [];
      // loop through every betslip and chech if he is winner or losser
      for(let betslip of result.rows)
        betslip.total_bets == betslip.total_wins ? win_betslips.push(betslip.id) : loss_betslips.push(betslip.id);
      // winners mark with 'win', looser mark with 'loss'
      win_betslips.length && betslipResult(win_betslips, 'win');
      loss_betslips.length && betslipResult(loss_betslips, 'loss');
      // resolve promise
      resolve();
    })
  });
}

// function to handle results in single betslips
const handleResultsInSingle = () => {
  return new Promise((resolve, reject) => {
    // query that returns all winner pairs from all unprocessed betslips
    pool.query(long_queries.betslip.wins_in_single, (error, result) => {
      if (error) reject(0);
      // there's a bit different logic than in results for multiple betslips
      // since there's no primary key in table betslip_bets, we separate unique winner betslips from winner pairs
      var win_betslips = [], win_pairs = [];
      // loop through every pair, if pair is from betslip that's not already in array 'win_betslips', add it
      // push every new winner pair to array 'win_pairs'
      for(let pair of result.rows){
        win_betslips.indexOf(pair.betslip_id) == -1 && win_betslips.push(pair.betslip_id);
        win_pairs.push({ betslip_id: pair.betslip_id, quota_id: pair.quota_id });
      }
      // if there are winner betslips, mark them with 'win'
      win_betslips.length && betslipResult(win_betslips, 'win');
      // if there are winner pairs, mark them too, with 'win'
      win_pairs.length && winPairs(win_pairs);
      // resolve at the end
      resolve()
    });
  });
}

// function to mark winner betslips
const betslipResult = (betslips, status) => {
  var params = []; // params for query builder
  // we saved winner betslips in array, but we don't know how many of them would be there
  // so we counstruct query like this
  // we could handle this also by sending new request for every betslip, but it's better that our sql database handles them all together
  // we save time and resources 
  for(var i = 2; i <= betslips.length+1; i++)
    params.push('$' + i);
  // build query
  var query = 'UPDATE betslip SET status=$1 WHERE id IN ('+params.join(', ')+')';
  pool.query(query, [status, ...betslips], (error) => {if(error) throw error});
}

// function to mark winner pairs
const winPairs = (pairs) => {
  // we have to mark one pair at the time (can't use same logic as in betslipResult because there's no primary key)
  for(let pair of pairs)
    pool.query('UPDATE betslip_bet SET status=$1 WHERE betslip_id=$2 AND quota_id=$3', ['win', pair.betslip_id, pair.quota_id], (error) => {if(error) throw error});
}

// middleware function to check if cashout for selected betslip is available before proceeding to cashout
const isCashoutAvailable = (req, res, next) => {
  // only type and status columns are needed for validation and cashout (type because we need to extract cashout amount based on betting type single or multiple)
  pool.query('SELECT type, status FROM betslip WHERE id=$1', [req.body.query.betslip_id], (err, result) => {
    if (err) throw err;
    if (result.rowCount && result.rows[0].status == 'win'){
      req.betslip = result.rows[0]; // store type and status of validated betslip to request
      next();
    } else if(result.rowCount && result.rows[0].status == 'cashedout')
      res.status(422).json({ error: error.already_cashedout })
    else
      res.status(422).json({ error: error.cashout_not_available })
  })
}

// function for cashout
const cashout = (req, res) => {
  const { body: { query: { betslip_id } }, payload: { email } } = req;
  // select query based on betslip type
  var query = req.betslip.type == 'multiple' ? long_queries.betslip.get_cashout_multiple : long_queries.betslip.get_cashout_single;

  pool.query(query, [betslip_id, email], (err, result) => {
    if (err) throw err;
    if (result.rowCount) 
      transaction(email, result.rows[0].cashout, betslip_id) // after extracted cashout amount, procced with transaction to user balacne
        .then(() => res.sendStatus(200))
        .catch(() => res.status(422).json({ error: error.cashout_error }));
  })
}

// function to perform transaction, cashout to user balance
const transaction = (email, amount, betslip_id) => {
  return new Promise((resolve, reject) => {
    // get current user saldo (get from database because if we get it from request we don't want someone to intercept request and send not valid current saldo)
    getUserSaldo(email).then(userSaldo => {
      var new_saldo = (parseFloat(userSaldo) + parseFloat(amount)).toFixed(2); // add new amount to current saldo
      // update new saldo in db
      pool.query('UPDATE public."user" SET saldo=$1 WHERE email=$2', [new_saldo, email], (error, result) => {
        if (error) reject();
        // update current betslip, set status to 'cashedout'
        pool.query('UPDATE betslip SET status=$1 WHERE id=$2', ['cashedout', betslip_id], (error, result) => {
          if (error) reject();
          resolve();
        })
      })

    })
  })
}

// function to get users saldo with email
var getUserSaldo = (email) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT saldo FROM public."user" WHERE email=$1 LIMIT 1', [email], (error, result) => {
      if (error) throw error;
      if (result.rowCount == 0) reject(1);
      resolve(result.rows[0].saldo);
    })
  })
}

module.exports = { createBetslip, createBetslipBet, processBets, isCashoutAvailable, cashout };