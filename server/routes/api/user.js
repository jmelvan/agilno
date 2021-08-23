const router = require('express').Router();
const { error } = require('../../config');
const user = require('../../database/user');

// signup route for adding new users
router.post('/signup', (req, res, next) => {
  const { body } = req;

  //check all required fields
  if(!body || !body.email || !body.password) 
    return res.status(422).json({ error: error.fields });

  //request database to see if email exists
  user.getUser(body.email).then(result => {
    if(result.length == 0) // create new user if email doesn't exists
      user.createUser(body.email, body.password).then(() => res.status(200).send("success"));
    else
      res.status(422).json({error: error.email_exists})
  });
});

// route for validating new users
router.get('/validate/:hash', user.validateUser);

module.exports = router;