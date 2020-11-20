const express = require('express');
const comments = require('../controller/comments');

const router = express.Router();

router.get('/comments', comments.allComments);
router.get('/comments/:id', comments.findSong);
router.get('/user/comment/:id', comments.findComment);
router.post('/comment', comments.addComment);
router.post('/comment/:id', comments.addSpecificComment);
router.put('/comment', comments.updateComment);
router.delete('/comment/:id', comments.deleteComment);

module.exports = router;
