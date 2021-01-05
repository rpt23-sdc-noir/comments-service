/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 3000 }, // below normal load
    { duration: '1m', target: 3000 },
    { duration: '10s', target: 3500 }, // normal load
    { duration: '1m', target: 3500 },
    { duration: '10s', target: 4000 }, // around the breaking point
    { duration: '1m', target: 4000 },
    { duration: '10s', target: 4500 }, // beyond the breaking point
    { duration: '1m', target: 4500 },
    { duration: '30s', target: 0 }, // scale down. Recovery stage.
  ],
  thresholds: {
    errors: ['rate<0.03'], // <3% errors
  },
};

export default () => {
  const req1 = {
    method: 'GET',
    url: `http://localhost:4000/comments/${Math.floor(Math.random() * 100) + 1}`,
  };

  const res = http.batch([req1]);
  const result = check(res[0], { 'is status 200': (r) => r.status === 200 });
  errorRate.add(!result);
  sleep(1);
};