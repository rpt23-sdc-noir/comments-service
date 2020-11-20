/* eslint-disable no-console */
const db = require('../db');

const allComments = async (req, res) => {
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
};

const findSong = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await db.getComment(id);

    if (!comment || id > 100) {
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

    const comment = await db.getUserComment(id);

    if (!comment || id > 100) {
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
};

const addSpecificComment = async (req, res) => {
  try {
    const { id } = req.params;

    const newComment = {
      comment_id: id,
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
};

const updateComment = async (req, res) => {
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
};

const deleteComment = async (req, res) => {
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
};

module.exports = {
  allComments,
  findSong,
  findComment,
  addComment,
  addSpecificComment,
  updateComment,
  deleteComment,
};
