/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const path = require('path');
const expressStaticGzip = require('express-static-gzip');
// const db = require('../db');
const router = require('./routes');
// require('newrelic');

const port = process.env.PORT || 4000;

const app = express();

app.use(
  '/',
  expressStaticGzip('./dist', {
    enableBrotli: true,
    orderPreference: ['br', 'gz'],
    setHeaders(res) {
      res.setHeader('Cache-Control', 'dist, max-age=31536000');
    },
  }),
);

app.use(express.json());
app.use(cors());

app.use('/', router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

module.exports = app;
