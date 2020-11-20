/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const path = require('path');
const expressStaticGzip = require('express-static-gzip');
const db = require('../db');

const port = 4000;

const app = express();

// app.use(express.static('./dist'));
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

    const comment = await db.getComment(id);

    if (!comment || id > 100) {
      return res.status(400).json({
        succes: false,
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
      succes: false,
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
    const lastComment = await db.lastComment();

    const newComment = {
      comment_id: lastComment[0].comment_id + 1,
      user_id: req.body.user_id,
      song_id: req.body.song_id,
      content: req.body.content,
      time_stamp: req.body.time_stamp,
    };

    const storedComment = await db.saveComment(newComment);

    res.status(201).send({
      success: true,
      data: storedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      msg: error,
    });
  }
});

app.put('/comment', async (req, res) => {
  try {
    const updatedComment = await db.updateComment(
      req.body.comment_id,
      req.body.content,
    );

    if (updatedComment.n === 0) {
      res.status(400).send('Bad request');
    } else {
      res.status(200).send({
        success: true,
        msg: updatedComment,
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
