const csvtojson = require('csvtojson');
const mongoose = require('mongoose');
const db = require('../db');

csvtojson()
  .fromFile('./seed/comments.csv')
  .then((csvData) => {
    // eslint-disable-next-line no-console
    db.dropDB()
      .then(() => db.insertMany(csvData))
      .then(() => {
        setTimeout(() => {
          mongoose.disconnect();
        }, 1000);
      });
  });
