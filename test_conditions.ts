import { calculateChangeData, getDataFromDatabase } from "getSmartData";
import fs from "fs";

import todaysData from "./Jan27.json";
import yesterdaysData from "./Jan26.json";

const today = [
  {
    region: "Region  2",
    wait_list_type: "Heart Status 1A",
    wait_list_time: "All Time",
    blood_type_all: 10.0,
    blood_type_o: 6.0,
    blood_type_a: 1.0,
    blood_type_b: 2.0,
    blood_type_ab: 1.0,
    report_date: "2025-02-15",
  },
  {
    region: "Region  2",
    wait_list_type: "Heart Status 1B",
    wait_list_time: "All Time",
    blood_type_all: 10.0,
    blood_type_o: 6.0,
    blood_type_a: 1.0,
    blood_type_b: 2.0,
    blood_type_ab: 1.0,
    report_date: "2025-02-15",
  },
  {
    region: "Region  2",
    wait_list_type: "Heart Status 2",
    wait_list_time: "All Time",
    blood_type_all: 10.0,
    blood_type_o: 6.0,
    blood_type_a: 1.0,
    blood_type_b: 2.0,
    blood_type_ab: 1.0,
    report_date: "2025-02-15",
  },
  {
    region: "Region  2",
    wait_list_type: "Heart Status 7 (Inactive)",
    wait_list_time: "All Time",
    blood_type_all: 10.0,
    blood_type_o: 6.0,
    blood_type_a: 1.0,
    blood_type_b: 2.0,
    blood_type_ab: 1.0,
    report_date: "2025-02-15",
  },
];

const yesterday = [
  {
    region: "Region  2",
    wait_list_type: "Heart Status 1A",
    wait_list_time: "All Time",
    blood_type_all: 10.0,
    blood_type_o: 6.0,
    blood_type_a: 1.0,
    blood_type_b: 2.0,
    blood_type_ab: 1.0,
    report_date: "2025-02-14",
  },
  {
    region: "Region  2",
    wait_list_type: "Heart Status 1B",
    wait_list_time: "All Time",
    blood_type_all: 10.0,
    blood_type_o: 6.0,
    blood_type_a: 1.0,
    blood_type_b: 2.0,
    blood_type_ab: 1.0,
    report_date: "2025-02-14",
  },
  {
    region: "Region  2",
    wait_list_type: "Heart Status 2",
    wait_list_time: "All Time",
    blood_type_all: 10.0,
    blood_type_o: 6.0,
    blood_type_a: 1.0,
    blood_type_b: 2.0,
    blood_type_ab: 1.0,
    report_date: "2025-02-14",
  },
  {
    region: "Region  2",
    wait_list_type: "Heart Status 7 (Inactive)",
    wait_list_time: "All Time",
    blood_type_all: 10.0,
    blood_type_o: 6.0,
    blood_type_a: 1.0,
    blood_type_b: 2.0,
    blood_type_ab: 1.0,
    report_date: "2025-02-14",
  },
];

async function main() {
  // Engine
  // const { todaysData, yesterdaysData } = await getDataFromDatabase(
  //   // "2025-01-24",
  //   // "2025-01-23"
  //   // "2025-01-15",
  //   // "2025-01-14"
  //   // "2024-11-04",
  //   // "2024-11-03"
  //   "2025-01-27",
  //   "2025-01-26"
  // );
  // fs.writeFile("Jan27.json", JSON.stringify(todaysData, null, 2), (err) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log("Created new file successfully");
  //   }
  // });
  // fs.writeFile("Jan26.json", JSON.stringify(yesterdaysData, null, 2), (err) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log("Created new file successfully");
  //   }
  // });

  const calculatedChanges = await calculateChangeData(
    todaysData,
    yesterdaysData
  );
  // console.log(calculatedChanges);
  fs.writeFile(
    "TestConditionChangeData.json",
    JSON.stringify(calculatedChanges, null, 2),
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Created new file successfully");
      }
    }
  );
}

main();

// Test 1 (Already on the list and Dropped Status)
// Dropped from Status 1A (Removed) to Status 1B (Added)
// Dropped from Status 1A (Removed) to Status 2 (Added)
// Dropped from Status 1A (Removed) to Status 7 (Added)
// Dropped from Status 1B (Removed) to Status 2 (Added)
// Dropped from Status 1B (Removed) to Status 7 (Added)
// Dropped from Status 2 (Removed) to Status 7 (Added)

// Test 2 (Already on the list and Bumped Up Status)
// Bumped From Status 7 (Removed) to Status 2 (Added)
// Bumped From Status 7 (Removed) to Status 1B (Added)
// Bumped From Status 7 (Removed) to Status 1A (Added)
// Bumped From Status 2 (Removed) to Status 1B (Added)
// Bumped From Status 2 (Removed) to Status 1A (Added)
// Bumped From Status 1B (Removed) to Status 1A (Added)

// Test 3 (New Patient Added To Transplant Waiting List)
// Added to Status 1A
// Added to Status 1B
// Added to Status 2
// Added to Status 7

// Test 4 (Existing Patient Removed From Transplant Waiting List)
// Tranplant, Got Better, Died
// Removed from Status 1A
// Removed from Status 1B
// Removed from Status 2
// Removed from Status 7
