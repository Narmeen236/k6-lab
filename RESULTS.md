# K6 lab results

## Part 0
- Step 0.1, http_req_duration: avg=283.56ms, min=283.56ms, med=283.56ms, max=283.56ms, p(90)=283.56ms, p(95)=283.56ms

- Step 0.2, requests, rate and p(95), and why the rate stays below 5: 
Requests: 67, Rate: 3.17 req/s, p(95): 720.58ms.
The rate stays below 5 req/s because each iteration includes sleep(1) (1 second think time) plus the HTTP request duration (~0.42s). One complete iteration for one virtual user takes about 1.42s, so 5 users running for 20 seconds can complete around 67 requests in total (~3.17 req/s).

- Step 0.6, exit code of the normal run and of the run with P95=300: Normal run exit code: 0, Run with P95=300 exit code: 99 

- Step 0.7, rules that passed, p(95), p(99), exit code after your change: 
All rules passed (http_req_failed: 0.00%, p(95)<1000, p(99)<1500). Measured p(95) = 677.43ms, p(99) = 760.5ms. Exit code after strict threshold change: 99.

- Step 0.8, what was wrong, and how the checks showed it: The initial request sent 'pepperoni' and 'knife' in lowercase. As revealed by explore.js, the QuickPizza API expects capitalized strings ('Pepperoni' and 'Knife'). Because the API ignored the lowercase exclusions, it returned pizzas with pepperoni or requiring a knife, causing checks to fail under load. Correcting the casing to 'Pepperoni' and 'Knife' fixed the payload and all checks succeeded.

## Part A results
| Step | Test type | Users | Req/s | p(95) | Max | Failed | Checks |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | Smoke | 1 | 0.4451 | 573.25ms | 579.78ms | 0.00% | 100.00% |
| A2 | Average load | 3 | 1.26 | 539.22ms | 1.68s | 0.00% | 100.00% |
| A3 | Stress | 5 | 2.12 | 508.14ms | 1.62s | 0.00% | 100.00% |
| A4 | Spike | 5 | 1.01 | 524.52ms | 1.35s | 0.00% | 100.00% |
| A5 | Soak | 2 | 0.81 | 464.81ms | 1m0s | 0.92% | 99.16% |

- Step A4, did the response time rise during the spike, and how long did it take to return to its earlier level?

Yes, max latency bumped up to 1.35s during the 1-to-5 VU spike. But p(95) stayed smooth at 524.52ms with zero errors (0% failed). Once users dropped back to 1, response times recovered to normal (~350ms) in about 6 seconds.

- Step A5, compare the response time in the first minutes with the last minutes. Did the response time or the error rate get worse as the test went on?

The overall response time remained consistent around ~300ms-460ms between the initial and final minutes. A brief network timeout occurred around minute 9.5, causing a minor 0.92% failure rate, but the system quickly recovered and stayed well within all configured thresholds.

## Part B
1. Fill in the results table for Steps A1 to A5.

| Test script | Users | Req/s | p(95) | Max | Failed | Checks |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `a1-smoke.js` | 1 | 0.45 | 573.25ms | 579.78ms | 0.00% | 100.00% |
| `a2-average.js` | 3 | 1.26 | 539.22ms | 1.68s | 0.00% | 100.00% |
| `a3-stress.js` | 5 | 2.12 | 508.14ms | 1.62s | 0.00% | 100.00% |
| `a4-spike.js` | 5 | 1.01 | 524.52ms | 1.35s | 0.00% | 100.00% |
| `a5-soak.js` | 2 | 0.81 | 464.81ms | 1m0s | 0.92% | 99.16% |

2. In Step 0.2, why was the request rate below 5 requests per second with 5 virtual users?

Because each iteration in the script included sleep times (pacing/think time) between requests, and network latency added to the total iteration duration. Since each VU takes several seconds to complete one full loop, 5 VUs cannot execute 5 requests every second.

3. Did the response time grow from the average-load test to the stress test? Explain your answer with the operational envelope.

No, the response time stayed almost identical (p(95) was 539.22ms in average-load vs 508.14ms in stress test). This means 5 VUs is well within the system's operational envelope, so the server handled the load comfortably without hitting saturation or performance degradation.

4. In the spike test, how long did the response time take to return to normal after the spike?

It returned to baseline levels (~350ms-400ms) almost immediately within 1 iteration duration (around 6 seconds) as soon as VUs dropped back from 5 to 1.

5. In the soak test, did the response time or the error rate get worse over time? Name one kind of defect that a soak test of several hours could reveal.

The response time stayed consistent around ~300ms-460ms. A brief network timeout occurred around minute 9.5, causing a minor 0.92% error rate, but the system quickly recovered. A multi-hour soak test can reveal memory leaks or database connection pool exhaustion.

6. Why do the thresholds in this lab use p(95) rather than the average?

The average can hide severe outliers or slow individual requests. p(95) ensures that 95% of users experience response times under the target threshold, providing a much better representation of real user experience.

7. Your results come from a shared public site reached over the internet. Give two reasons why the same tests against a system in a lab could give different numbers.

First, public internet routing introduces variable latency and packet loss compared to a low-latency local network. Second, a shared public site experiences noisy-neighbor traffic from other users simultaneously, whereas a local lab environment provides isolated resources.

8. Why must you never run a stress, spike or breakpoint test with hundreds of users against a site that you do not own?

It can cause an unintended Distributed Denial of Service (DDoS), degrading service for legitimate users, crashing the server, and potentially violating law or terms of service.

9. Write one vague performance requirement for an app you use every day. Rewrite it as a testable requirement, and show the K6 thresholds that check it.

- Vague: "The Instagram feed should load fast when opened."
- Testable: "95% of home feed API requests must respond in under 800ms with an error rate below 1% under a load of 10 VUs."
- K6 Thresholds:
```javascript
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
  },
};