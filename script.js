/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import { sleep } from 'k6';

export default () => {
  http.get(`http://localhost:4000/comments/${Math.floor(Math.random() * 1000) + 1}`);
  sleep(1);
};
