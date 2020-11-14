const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/fec-soundcloud-comments', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('mongodb connected!')
});

// db.dropCollection("comments", () =>  {
//   console.log("comments collection dropped");
// });

const commentSchema = new mongoose.Schema({
  comment_id: {
    type: Number,
    unique: true,
    required: true
  },
  user_id: Number,
  song_id: Number,
  content: String,
  time_stamp: Number
});

const Comment = mongoose.model('Comment', commentSchema);

const saveComment = (comment) => {
  let newComment = new Comment({
    comment_id: comment.comment_id,
    user_id:    comment.user_id,
    song_id:    comment.song_id,
    content:    comment.content,
    time_stamp: comment.time_stamp

  });

  return newComment.save(newComment);
}

const getComments = () => {
  return Comment.find().limit(1000);
}

const getComment = (song_id) => {
  return Comment.find({ song_id })
}

const lastComment = () => {
  return Comment.find().sort({ comment_id:-1 }).limit(1)
}

const updateComment = (comment_id, content) => {
  return Comment.updateOne({comment_id}, {content})
}

const deleteComment = (comment_id) => {
  return Comment.deleteOne({comment_id})
}

module.exports = {
  getComments,
  getComment,
  saveComment,
  lastComment,
  updateComment,
  deleteComment
}