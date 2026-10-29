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
1. 
2. 
3. 
4. 
5. 
6. 
7. 
8. 
9.