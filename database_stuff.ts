import "dotenv/config";
// Generated with CLI
import { getXataClient } from "src/xata";
const xata = getXataClient();

// import * as transplantData from "./DatabaseWaitingList.json" assert { type: "json" };

import { readFile } from "fs/promises";
const transplantData = JSON.parse(
  await readFile(new URL("./DatabaseWaitingList.json", import.meta.url))
);

const centerData = JSON.parse(
  await readFile(new URL("./CenterHeartCount.json", import.meta.url))
);

const donorData = JSON.parse(
  await readFile(new URL("./DatabaseDonorList.json", import.meta.url))
);

// const page = await xata.db.transplant_data.getPaginated();
// console.log(page.records);

// const td = {
//   region: "Region  1",
//   blood_type: "All ABO",
//   empty: "",
//   all_types: 17,
//   heart_status_1A: 5,
//   heart_status_1B: 7,
//   heart_status_2: 1,
//   heart_status_7_inactive: 4,
//   report_date: "2024-03-24T00:00:00.000-04:00",
// };

// const dater = await xata.db.transplant_data.create(td);

// for (let index = 0; index < transplantData.length; index++) {
//   const element = transplantData[index];
//   console.log(element);
//   const dater = await xata.db.transplant_data.create(transplantData);
//   console.log(dater);
// }

const dater = await xata.db.transplant_data.create(transplantData);

console.log(dater);

const center = await xata.db.center_data.create(centerData);

console.log(center);

const donors = await xata.db.donor_data.create(donorData);

console.log(donors);
