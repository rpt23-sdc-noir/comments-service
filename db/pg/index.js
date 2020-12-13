/* eslint-disable camelcase */
/* eslint-disable no-console */
const pool = require('./pg');

const saveComment = (comment) => pool.query(`INSERT INTO comments VALUES (${comment.comment_id}, ${comment.user_id}, ${comment.song_id}, '${comment.content}', ${comment.time_stamp}) RETURNING *;`)
  .then((result) => result.rows[0]);

const getComments = () => pool.query('SELECT * FROM comments LIMIT 1000;')
  .then((result) => result.rows);

const getComment = (song_id) => pool.query(`SELECT * FROM comments WHERE song_id = ${song_id} LIMIT 1000;`)
  .then((result) => result.rows);

const getUserComment = (comment_id) => pool.query(`SELECT * FROM comments WHERE comment_id = ${comment_id};`)
  .then((result) => result.rows);

const lastComment = () => pool.query('SELECT * FROM comments ORDER BY comment_id DESC LIMIT 1;')
  .then((result) => result.rows);

const updateComment = (comment_id, content) => pool.query(`UPDATE comments SET content = '${content}' WHERE comment_id = ${comment_id};`)
  .then((result) => result.rowCount);

const deleteComment = (comment_id) => pool.query(`DELETE FROM comments WHERE comment_id = ${comment_id};`)
  .then((result) => result.rowCount);

module.exports = {
  getComments,
  getComment,
  getUserComment,
  saveComment,
  lastComment,
  updateComment,
  deleteComment,
};
