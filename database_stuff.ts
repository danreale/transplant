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

// add data for a region/blood type if its missing. Just enter all zeros
const regions = [
  "Region  1",
  "Region  2",
  "Region  3",
  "Region  4",
  "Region  5",
  "Region  6",
  "Region  7",
  "Region  8",
  "Region  9",
  "Region  10",
  "Region  11",
];
for (let index = 0; index < regions.length; index++) {
  const region = regions[index];
  // console.log(region);
  const entries = transplantData.filter((d: any) => d.region === region);
  // console.log(entries);
  if (entries.length !== 3) {
    // find out which one is missing and add the extra record
    const bloodTypes = entries.map((b: any) => b.blood_type);
    // console.log(bloodTypes);
    if (!bloodTypes.includes("All ABO")) {
      console.log(`Adding missing ABO data for ${region}...`);
      const obj = {
        region: region,
        blood_type: "All ABO",
        empty: "",
        all_types: 0,
        heart_status_1A: 0,
        heart_status_1B: 0,
        heart_status_2: 0,
        heart_status_7_inactive: 0,
        report_date: transplantData[0].report_date,
      };
      const aboData = await xata.db.transplant_data.create(obj);
      console.log(aboData);
    }
    if (!bloodTypes.includes("B")) {
      console.log(`Adding missing B data for ${region}...`);
      const obj = {
        region: region,
        blood_type: "B",
        empty: "",
        all_types: 0,
        heart_status_1A: 0,
        heart_status_1B: 0,
        heart_status_2: 0,
        heart_status_7_inactive: 0,
        report_date: transplantData[0].report_date,
      };
      const bData = await xata.db.transplant_data.create(obj);
      console.log(bData);
    }
    if (!bloodTypes.includes("O")) {
      console.log(`Adding missing O data for ${region}...`);
      const obj = {
        region: region,
        blood_type: "O",
        empty: "",
        all_types: 0,
        heart_status_1A: 0,
        heart_status_1B: 0,
        heart_status_2: 0,
        heart_status_7_inactive: 0,
        report_date: transplantData[0].report_date,
      };
      const oData = await xata.db.transplant_data.create(obj);
      console.log(oData);
    }
  }
}

const center = await xata.db.center_data.create(centerData);

console.log(center);

const donors = await xata.db.donor_data.create(donorData);

console.log(donors);
