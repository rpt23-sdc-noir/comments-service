/* eslint-disable no-console */
require('dotenv').config();

const user = process.env.COUCH_USER;
const password = process.env.COUCH_PASSWORD;
const host = process.env.COUCH_HOST;

const nano = require('nano')(`http://${user}:${password}@${host}:5984`);

nano.db.create('sdc_comments')
  .then(() => console.log('comments db created!'));

module.exports = nano;
