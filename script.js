/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 1000 }, // below normal load
    { duration: '1m', target: 1000 },
    { duration: '10s', target: 1500 }, // normal load
    { duration: '1m', target: 1500 },
    { duration: '10s', target: 2000 }, // around the breaking point
    { duration: '1m', target: 2000 },
    { duration: '10s', target: 2500 }, // beyond the breaking point
    { duration: '1m', target: 2500 },
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

  const data = {
    content: 'Updated',
  };
  const req2 = {
    method: 'PUT',
    url: `http://localhost:4000/comment/${Math.floor(Math.random() * 10000000) + 1}`,
    body: JSON.stringify(data),
    params: {
      headers: { 'Content-Type': 'application/json' },
    },
  };

  const res = http.batch([req1, req2]);
  const result = check(res[1], { 'is status 200': (r) => r.status === 200 });
  errorRate.add(!result);
};
