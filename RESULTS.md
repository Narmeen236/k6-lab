# K6 lab results

## Part 0
Step 0.1, http_req_duration: avg=283.56ms, min=283.56ms, med=283.56ms, max=283.56ms, p(90)=283.56ms, p(95)=283.56ms

Step 0.2, requests, rate and p(95), and why the rate stays below 5: 
Requests: 67, Rate: 3.17 req/s, p(95): 720.58ms.
The rate stays below 5 req/s because each iteration includes sleep(1) (1 second think time) plus the HTTP request duration (~0.42s). One complete iteration for one virtual user takes about 1.42s, so 5 users running for 20 seconds can complete around 67 requests in total (~3.17 req/s).

Step 0.6, exit code of the normal run and of the run with P95=300: Normal run exit code: 0, Run with P95=300 exit code: 99 

Step 0.7, rules that passed, p(95), p(99), exit code after your change: 

Step 0.8, what was wrong, and how the checks showed it: 

## Part A results
| Step | Test type | Users | Req/s | p(95) | Max | Failed | Checks |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | Smoke | 1 | | | | | |
| A2 | Average load | 3 | | | | | |
| A3 | Stress | 5 | | | | | |
| A4 | Spike | 5 | | | | | |
| A5 | Soak | 2 | | | | | |

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