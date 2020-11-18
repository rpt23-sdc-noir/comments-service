/* eslint-disable no-console */
/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const { LoremIpsum } = require('lorem-ipsum');
const commentDb = require('./db/index');

const maxComments = Math.floor(Math.random() * 200) + 37;
const maxSongLength = 480; // in seconds, how long song is

const lorem = new LoremIpsum({
  wordsPerSentence: {
    max: 8,
    min: 4,
  },
});

const randoUserId = () => Math.floor(Math.random() * 10) + 1;

const randoSongId = () => Math.floor(Math.random() * 100) + 1;

const randoTimeStamp = (maxTime) => Math.floor(Math.random() * maxTime);

for (let i = 1; i <= maxComments; i++) {
  const tempComment = {
    comment_id: i,
    user_id: randoUserId(),
    song_id: randoSongId(),
    content: lorem.generateSentences(1),
    time_stamp: randoTimeStamp(maxSongLength),
  };

  commentDb
    .saveComment(tempComment)
    .then((comment) => console.log(`comment '${comment.content}' added`))
    .catch((error) => console.error(error.message));

  if (i === maxComments) {
    setTimeout(() => {
      mongoose.disconnect();
    }, 600);
  }
}
