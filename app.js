'use strict';

const express = require('express');
const morgan = require('morgan');
const { resolve } = require('path');
const db = require('./db/models');

const app = express();

// logging middleware
app.use(morgan('dev'));

// serve static files from public
app.use('/public', express.static('public'));

// request any page and receive index.html
app.get('/*', (req, res) => res.sendFile(resolve(__dirname, 'index.html')));

// server listening!
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening on port', 3000);
  db.sync({force: false})
  .then(() => {
    console.log('Database is up and running');
  })
  .catch(err => console.error(err));
});
