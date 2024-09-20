import { group, check } from "k6";
import http from "k6/http";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.4/index.js";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export const options = {
  // insecureSkipTLSVerify: true,
  ext: {},
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(90) < 2000", "p(95) < 3000", "p(99.9) < 5000"],
    checks: ["rate>0.9"],
  },
  stages: [
    { target: 1, duration: "10s" },
    // { target: 2, duration: "10s" },
    // { target: 5, duration: "30s" },
    // { target: 0, duration: "10s" },
  ],
};

const raceData = [
  { captureDate: "2024-02-25", raceDate: "2024-02-24", track: "OP", race: "1" },
  { captureDate: "2024-02-26", raceDate: "2024-02-25", track: "OP", race: "4" },
  {
    captureDate: "2024-02-25",
    raceDate: "2024-02-24",
    track: "AQU",
    race: "6",
  },
  {
    captureDate: "2024-02-26",
    raceDate: "2024-02-25",
    track: "TAM",
    race: "7",
  },
  {
    captureDate: "2024-02-27",
    raceDate: "2024-02-26",
    track: "MVD",
    race: "4",
  },
];

export function handleSummary(data) {
  return {
    "HeartTransplant.html": htmlReport(data),
    "HeartTransplant.json": JSON.stringify(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

export default function () {
  const randomRace = randomItem(raceData);

  let response;

  group("Home Page", function () {
    response = http.get(
      "https://myhorsestable.netlify.app/kentuckyderby?_data=routes%2Fkentuckyderby._index"
    );
    check(response, {
      "Get Derby Data": (r) => r.status === 200,
    });
  });

  group("Today Page", function () {
    response = http.get(
      "https://myhorsestable.netlify.app/kentuckyderby?_data=routes%2Fkentuckyderby._index"
    );
    check(response, {
      "Get Derby Data": (r) => r.status === 200,
    });

    // Wait list types
    // 1a
    // 1b
    // 2
    // 7
  });

  group("Yesterdays Page", function () {
    response = http.get(
      "https://myhorsestable.netlify.app/kentuckyderby?_data=routes%2Fkentuckyderby._index"
    );
    check(response, {
      "Get Derby Data": (r) => r.status === 200,
    });
  });

  group("Any Days Page", function () {
    response = http.get(
      "https://myhorsestable.netlify.app/kentuckyderby?_data=routes%2Fkentuckyderby._index"
    );
    check(response, {
      "Get Derby Data": (r) => r.status === 200,
    });
  });

  group("Region Charts Page", function () {
    response = http.get(
      "https://myhorsestable.netlify.app/kentuckyderby?_data=routes%2Fkentuckyderby._index"
    );
    check(response, {
      "Get Derby Data": (r) => r.status === 200,
    });
    // do this for each region
  });

  group("USA Charts Page", function () {
    response = http.get(
      "https://myhorsestable.netlify.app/kentuckyderby?_data=routes%2Fkentuckyderby._index"
    );
    check(response, {
      "Get Derby Data": (r) => r.status === 200,
    });
  });
}
