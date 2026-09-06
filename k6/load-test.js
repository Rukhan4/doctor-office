import http from "k6/http";
import { check, sleep, group } from "k6";

// Smoke-sized load test: enough to catch gross performance regressions and
// crashes under concurrency without needing dedicated infrastructure.
//
//   Local:  k6 run k6/load-test.js
//   CI:     BASE_URL set by the workflow against `npm run start`

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  scenarios: {
    browsing: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 10 },
        { duration: "30s", target: 10 },
        { duration: "10s", target: 0 },
      ],
      gracefulRampDown: "5s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<800"],
    "http_req_duration{page:home}": ["p(95)<800"],
    checks: ["rate>0.99"],
  },
};

const PAGES = [
  { name: "home", path: "/" },
  { name: "contact", path: "/contact" },
  { name: "news", path: "/news" },
  { name: "sitemap", path: "/sitemap.xml" },
];

export default function () {
  for (const page of PAGES) {
    group(page.name, () => {
      const res = http.get(`${BASE_URL}${page.path}`, {
        tags: { page: page.name },
      });
      check(res, {
        "status is 200": (r) => r.status === 200,
        "body is non-empty": (r) => r.body.length > 0,
      });
    });
    sleep(1);
  }
}
