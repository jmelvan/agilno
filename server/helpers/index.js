const { fields, error } = require('../config');

// function to check required fields
const checkRequiredFields = (req, res, next) => {
  const action = getActionFromURL(req.originalUrl);
  // loop through required fields, and check if they're defined in request
  for(let field of fields.required[action])
    if (!req.body || !req.body.query || !req.body.query[field]) return res.status(422).json({ error: error.fields });
  next();
}

// function to extract action from request url
const getActionFromURL = (url) => {
  var action = url.split('/'); // split url to array
  while(action.length != 2) 
    action.shift(); // pop first elements until only 2 left
  // join last 2 elements which gives us action
  return action.join('/');
}

module.exports = { checkRequiredFields }