/* eslint-disable camelcase */
/* eslint-disable no-console */
const mongoose = require('mongoose');
require('dotenv').config();

const dbHost = process.env.NODE_ENV === 'production' ? 'mongodb://mongo:27017/fec-soundcloud-comments' : process.env.MONGO_URI;

mongoose.connect(dbHost, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('mongodb connected!');
});

// db.dropCollection("comments", () =>  {
//   console.log("comments collection dropped");
// });

const commentSchema = new mongoose.Schema({
  comment_id: {
    type: Number,
    unique: true,
    required: true,
  },
  user_id: Number,
  song_id: Number,
  content: String,
  time_stamp: Number,
});

const Comment = mongoose.model('Comment', commentSchema);

const saveComment = (comment) => {
  const newComment = new Comment({
    comment_id: comment.comment_id,
    user_id: comment.user_id,
    song_id: comment.song_id,
    content: comment.content,
    time_stamp: comment.time_stamp,

  });

  return newComment.save(newComment);
};

const getComments = () => Comment.find().limit(1000);

const getComment = (song_id) => Comment.find({ song_id });

const getUserComment = (comment_id) => Comment.find({ comment_id });

const lastComment = () => Comment.find().sort({ comment_id: -1 }).limit(1);

const updateComment = (comment_id, content) => Comment.updateOne({ comment_id }, { content });

const deleteComment = (comment_id) => Comment.deleteOne({ comment_id });

const dropDB = () => db.dropDatabase();

// eslint-disable-next-line consistent-return
const insertMany = (comments) => Comment.insertMany(comments, (err, docs) => {
  if (err) {
    console.log(err);
    return err;
  }
  console.log(JSON.stringify(docs.length));
  return (docs.length);
});

module.exports = {
  getComments,
  getComment,
  getUserComment,
  saveComment,
  lastComment,
  updateComment,
  deleteComment,
  dropDB,
  insertMany,
};
