/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const { LoremIpsum } = require('lorem-ipsum');
const { createWriteStream } = require('fs');
const { Transform } = require('json2csv');
const { Readable } = require('stream');
// const shell = require('shelljs');

const maxComments = process.env.COMMENT_COUNT;
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

const input = new Readable({ objectMode: true });
input._read = () => {};

for (let i = 1; i <= maxComments; i++) {
  const tempComment = {
    comment_id: i,
    user_id: randoUserId(),
    song_id: randoSongId(),
    content: lorem.generateSentences(1),
    time_stamp: randoTimeStamp(maxSongLength),
  };
  input.push(tempComment);
}
input.push(null);
const output = createWriteStream('./seed/comments.csv', { encoding: 'utf8' });

const opts = {};
const transformOpts = { objectMode: true };

const json2csv = new Transform(opts, transformOpts);
input.pipe(json2csv).pipe(output);
output.on('finish', () => {
  console.log('seeded');
  // eslint-disable-next-line max-len
  // shell.exec('mongoimport --type csv -d fec-soundcloud-comments -c comments --headerline --drop /Users/abhogle/Documents/RPT23/SDC/comments-service/seed/comments.csv');
  mongoose.disconnect();
});
