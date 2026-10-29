import { journey } from './journey.js';

export const options = {
  stages: [
    { duration: '30s', target: 5 }, // Ramp up to 5 users
    { duration: '2m', target: 5 },  // Hold at 5 users for 2 minutes
    { duration: '30s', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    checks: ['rate>0.95'],
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  journey();
}