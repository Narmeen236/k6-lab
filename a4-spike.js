import { journey } from './journey.js';

export const options = {
  stages: [
    { duration: '30s', target: 1 }, // Start with 1 user for 30s
    { duration: '5s', target: 5 },  // Jump to 5 users within 5s (Spike!)
    { duration: '30s', target: 5 }, // Hold at 5 users for 30s
    { duration: '5s', target: 1 },  // Drop back to 1 user within 5s
    { duration: '1m', target: 1 },  // Stay at 1 user for 1 minute
    { duration: '10s', target: 0 }, // End with 10s ramp down
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