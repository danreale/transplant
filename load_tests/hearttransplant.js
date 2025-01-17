import { group, check } from "k6";
import http from "k6/http";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.4/index.js";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
const test_env = __ENV.TEST_ENV;

export const options = {
  // insecureSkipTLSVerify: true,
  cloud: {
    projectID: 3739847,
  },
  ext: {},
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(90) < 3000", "p(95) < 4000", "p(99.9) < 5000"],
    checks: ["rate>0.9"],
  },
  stages: [
    { target: 1, duration: "10s" },
    // { target: 2, duration: "10s" },
    // { target: 5, duration: "30s" },
    // { target: 0, duration: "10s" },
  ],
};

const getBaseUrl = () => {
  switch (test_env) {
    // local doesnt work
    case "local":
      return "http://127.0.0.1:5174";
    case "dev":
      return "https://deploy-preview-14--heart-transplant.netlify.app";
    case "prod":
      return "https://heart-transplant.netlify.app";

    default:
      throw new Error("Invalid Test Environment");
  }
};

const dates = [
  "2025-01-14",
  "2025-01-15",
  "2025-01-16",
  "2025-01-17",
  "2024-12-01",
  "2024-12-02",
  "2024-12-03",
  "2024-12-04",
  "2024-12-05",
  "2024-12-06",
  "2024-12-07",
  "2024-12-08",
  "2024-12-09",
  "2024-12-10",
  "2024-11-11",
  "2024-11-12",
  "2024-11-13",
  "2024-11-14",
  "2024-11-15",
  "2024-11-16",
  "2024-11-17",
  "2024-11-18",
  "2024-11-19",
  "2024-10-20",
  "2024-10-21",
  "2024-10-22",
  "2024-10-23",
  "2024-10-24",
  "2024-10-25",
  "2024-10-26",
  "2024-10-27",
  "2024-10-28",
  "2024-10-29",
  "2024-10-30",
  "2024-10-31",
  "2024-11-01",
  "2024-11-02",
  "2024-11-03",
  "2024-11-04",
  "2024-11-05",
  "2024-09-01",
  "2024-09-02",
  "2024-09-03",
  "2024-09-04",
  "2024-09-05",
  "2024-09-06",
  "2024-09-07",
  "2024-09-08",
  "2024-09-09",
  "2024-09-10",
  "2024-09-11",
  "2024-09-12",
  "2024-08-11",
  "2024-08-12",
  "2024-08-13",
  "2024-08-14",
  "2024-08-15",
  "2024-08-16",
  "2024-08-17",
  "2024-08-18",
  "2024-08-19",
  "2024-08-20",
  "2024-07-13",
  "2024-07-14",
  "2024-07-15",
  "2024-07-16",
  "2024-07-21",
  "2024-07-22",
  "2024-07-23",
  "2024-07-24",
  "2024-07-25",
  "2024-07-26",
  "2024-07-27",
  "2024-07-28",
  "2024-07-29",
  "2024-07-30",
  "2024-07-31",
];
const waitListTypes = [
  "Heart+Status+1A",
  "Heart+Status+1B",
  "Heart+Status+2",
  "Heart+Status+7+%28Inactive%29",
  "All+Types",
];
const region = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export function handleSummary(data) {
  return {
    "HeartTransplant.html": htmlReport(data),
    "HeartTransplant.json": JSON.stringify(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

export default function () {
  const randomDate = randomItem(dates);
  const randomWaitListType = randomItem(waitListTypes);
  const randomRegion = randomItem(region);

  let response;

  group("Home Page", function () {
    response = http.get(`${getBaseUrl()}`);
    check(response, {
      "Get Home Page Data": (r) => r.status === 200,
    });
  });

  group("Today Page", function () {
    response = http.get(
      `${getBaseUrl()}/today?waitListType=${randomWaitListType}`
    );
    check(response, {
      "Get Todays Data": (r) => r.status === 200,
    });
  });

  group("Yesterdays Page", function () {
    response = http.get(
      `${getBaseUrl()}/yesterday?waitListType=${randomWaitListType}`
    );
    check(response, {
      "Get Yesterdays Data": (r) => r.status === 200,
    });
  });

  group("Any Days Page", function () {
    response = http.get(
      `${getBaseUrl()}/day/${randomDate}?waitListType=${randomWaitListType}`
    );
    check(response, {
      "Get Day Data": (r) => r.status === 200,
    });
  });

  group("Region Charts Page", function () {
    response = http.get(`${getBaseUrl()}/charts/${randomRegion}`);
    check(response, {
      "Get Region Chart": (r) => r.status === 200,
    });
  });

  group("USA Charts Page", function () {
    response = http.get(`${getBaseUrl()}/charts`);
    check(response, {
      "Get USA Charts": (r) => r.status === 200,
    });
  });
}
