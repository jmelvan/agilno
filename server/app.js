const express = require('express');
var cors = require('cors')

const app = express();

// Configure app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(require('./routes'));

// start server
app.listen(8080, () => {
  console.log('Server running on http://localhost:8080/');
});