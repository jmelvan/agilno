const jwt = require('express-jwt');
const { secrets } = require('./index');

// function that returns token if found in request headers
const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;
  // check for field authorization in request headers
  if(authorization && authorization.split(' ')[0] === 'Bearer')
    return authorization.split(' ')[1]; // return token value, token example (Token 6a7fds64jnf6...)
  // return null if not found
  return null;
};

// Object containing middleware functions for jwt check
const auth = {
  required: jwt({
    secret: secrets.jwt,
    userProperty: 'payload',
    algorithms: ['HS256'],
    getToken: getTokenFromHeaders,
  })
}

module.exports = auth;