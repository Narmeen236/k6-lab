import { journey } from './journey.js';

export const options = {
  stages: [
    { duration: '30s', target: 2 }, // Ramp up to 2 users in 30s
    { duration: '10m', target: 2 }, // Hold at 2 users for 10 minutes
    { duration: '30s', target: 0 }, // Ramp down in 30s
  ],
  thresholds: {
    checks: ['rate>0.99'],
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
  },
};

export default function () {
  journey();
}