/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const path = require('path');
const expressStaticGzip = require('express-static-gzip');
const db = require('../db');

const port = 4000;

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

app.get('/comments', async (req, res) => {
  try {
    const comments = await db.getComments();
    res.status(200).send({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      msg: error,
    });
  }
});

app.get('/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let comment;
    if (Number.isInteger(JSON.parse(id))) {
      comment = await db.getComment(id);
    }

    if (!comment) {
      return res.status(400).json({
        success: false,
        msg: `no song with id ${id}`,
      });
    }

    if (comment.length === 0) {
      return res.status(400).json({
        succes: false,
        msg: `song ${id} doesn't have comments`,
      });
    }

    return res.status(200).send({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      msg: error,
    });
  }
});

app.get('/user/comment/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let comment;
    if (Number.isInteger(JSON.parse(id))) {
      comment = await db.getUserComment(id);
    }

    if (!comment) {
      return res.status(400).json({
        success: false,
        msg: `no comment with id ${id}`,
      });
    }

    if (comment.length === 0) {
      return res.status(400).json({
        success: false,
        msg: `comment ${id} doesn't have comments`,
      });
    }

    return res.status(200).send({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      msg: error,
    });
  }
});

app.get('/:current', (req, res) => {
  console.log('hit');
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.post('/comment', async (req, res) => {
  try {
    let commentId;
    if (req.query.id) {
      commentId = req.query.id;
    } else {
      const lastComment = await db.lastComment();
      commentId = lastComment[0].comment_id + 1;
    }

    const newComment = {
      comment_id: commentId,
      user_id: req.body.user_id,
      song_id: req.body.song_id,
      content: req.body.content,
      time_stamp: req.body.time_stamp,
    };

    const storedComment = await db.saveComment(newComment);

    return res.status(201).send({
      success: true,
      data: storedComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      msg: error,
    });
  }
});

app.put('/comment/:id', async (req, res) => {
  try {
    const updatedComment = await db.updateComment(
      req.params.id,
      req.body.content,
    );

    if (updatedComment.n === 0) {
      return res.status(400).send('Bad request');
    }
    return res.status(200).send({
      success: true,
      msg: updatedComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      msg: error,
    });
  }
});

app.delete('/comment/:id', async (req, res) => {
  try {
    const deletedComment = await db.deleteComment(JSON.parse(req.params.id));
    if (deletedComment.n === 0) {
      res.status(400).send('Bad request');
    } else {
      res.status(200).send({
        success: true,
        msg: deletedComment,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      msg: error,
    });
  }
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

module.exports = app;
