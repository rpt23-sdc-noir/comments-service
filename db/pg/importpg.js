/* eslint-disable no-console */
const pool = require('./pg');

pool.query("COPY comments FROM '/Users/abhogle/Documents/RPT23/SDC/comments-service/db/pg/comments.csv' DELIMITER ',' CSV HEADER;")
  .then((result) => {
    console.log(result.rowCount, 'records seeded.');
    pool.end();
  })
  .catch(() => {
    console.log('Error seeding the PGDB');
  });
