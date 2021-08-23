const express = require('express');
const session = require('express-session');

const app = express();

// Configure app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes'));

// start server
app.listen(8080, () => {
  console.log('Server running on http://localhost:8080/');
});