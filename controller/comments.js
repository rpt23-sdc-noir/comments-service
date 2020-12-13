/* eslint-disable camelcase */
/* eslint-disable no-console */
// const db = require('../db/index');
const pgdb = require('../db/pg/index');

const allComments = async (req, res) => {
  try {
    const comments = await pgdb.getComments();
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
};

const findSong = async (req, res) => {
  try {
    const { id } = req.params;

    let comment;
    if (Number.isInteger(Number(id))) {
      comment = await pgdb.getComment(id);
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
};

const findComment = async (req, res) => {
  try {
    const { id } = req.params;

    let comment;
    if (Number.isInteger(Number(id))) {
      comment = await pgdb.getUserComment(id);
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
};

const addComment = async (req, res) => {
  try {
    let comment_id;
    if (req.query.id) {
      comment_id = req.query.id;
    } else {
      const lastComment = await pgdb.lastComment();
      comment_id = lastComment[0].comment_id + 1;
    }

    const newComment = {
      comment_id,
      user_id: req.body.user_id,
      song_id: req.body.song_id,
      content: req.body.content,
      time_stamp: req.body.time_stamp,
    };

    const storedComment = await pgdb.saveComment(newComment);

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
};

const updateComment = async (req, res) => {
  try {
    const updatedComment = await pgdb.updateComment(
      req.params.id,
      req.body.content,
    );

    if (updatedComment === 0) {
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
};

const deleteComment = async (req, res) => {
  try {
    const deletedComment = await pgdb.deleteComment(Number(req.params.id));
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
};

module.exports = {
  allComments,
  findSong,
  findComment,
  addComment,
  updateComment,
  deleteComment,
};
