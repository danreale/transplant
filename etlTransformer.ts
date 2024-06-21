import data from "temp.json";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";

const todaysDate = DateTime.now()
  .setZone("America/New_York")
  .toFormat("yyyy-MM-dd");
// const formattedDate = DateTime.fromFormat(todaysDate, "yyyy-MM-dd");
console.log(todaysDate);

type TRANSPLANT_DATA = {
  region: string | null;
  wait_list_type: string | null;
  wait_list_time: string | null;
  blood_type_a: number | null;
  blood_type_b: number | null;
  blood_type_ab: number | null;
  blood_type_o: number | null;
  blood_type_all: number | null;
  report_date: string;
};
let transformedData: Array<TRANSPLANT_DATA> = [];
let finalTransformedData: Array<TRANSPLANT_DATA> = [];
let region = "";
let waitListType = "";
// do some more transformations on the data
for (let index = 0; index < data.length; index++) {
  const row = data[index];
  //  console.log(row);

  if (
    !row.WaitListTime &&
    !row["All ABO"] &&
    !row.O &&
    !row.A &&
    !row.B &&
    !row.AB
  ) {
    // skip the row and don't process it
  } else {
    // set the region
    if (row.Region) {
      region = row.Region;
    } else {
      region = region;
    }

    // set the wait list type
    if (row.WaitListType) {
      waitListType = row.WaitListType;
    } else {
      waitListType = waitListType;
    }
    const obj: TRANSPLANT_DATA = {
      region,
      wait_list_type: waitListType,
      wait_list_time: row.WaitListTime,
      blood_type_a: row.A,
      blood_type_b: row.B,
      blood_type_ab: row.AB,
      blood_type_o: row.O,
      blood_type_all: row["All ABO"],
      report_date: todaysDate,
    };
    transformedData.push(obj);
  }
}
// console.log(transformedData);

// transform again by checking to see if each region has all of the wait list times for each wait list type

const regions = [
  "All Regions",
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

const waitListTypes = [
  "All Types",
  "Heart Status 1A",
  "Heart Status 1B",
  "Heart Status 2",
  "Heart Status 7 (Inactive)",
];

const waitListTimes = [
  "All Time",
  "< 30 Days",
  "30 to < 90 Days",
  "90 Days to < 6 Months",
  "6 Months to < 1 Year",
  "1 Year to < 2 Years",
  "2 Years to < 3 Years",
  "3 Years to < 5 Years",
  "5 or More Years",
];

// Fill out missing data points

for (let index = 0; index < regions.length; index++) {
  const region = regions[index];

  for (let index = 0; index < waitListTypes.length; index++) {
    const waitListType = waitListTypes[index];

    for (let index = 0; index < waitListTimes.length; index++) {
      const waitListTime = waitListTimes[index];

      const dataExists = transformedData.filter(
        (r: TRANSPLANT_DATA) =>
          r.region === region &&
          r.wait_list_type === waitListType &&
          r.wait_list_time === waitListTime
      );
      if (dataExists.length > 0) {
        // console.log(dataExists);
        finalTransformedData.push(dataExists[0]);
      } else {
        console.log(
          `Data does not exists for ${region} - ${waitListType} - ${waitListTime}`
        );
        const obj: TRANSPLANT_DATA = {
          region,
          wait_list_type: waitListType,
          wait_list_time: waitListTime,
          blood_type_a: 0,
          blood_type_b: 0,
          blood_type_ab: 0,
          blood_type_o: 0,
          blood_type_all: 0,
          report_date: todaysDate,
        };
        // console.log(obj);
        finalTransformedData.push(obj);
      }
    }
  }
}
console.log(finalTransformedData);

const file = path.join(process.cwd(), "DatabaseWaitingList.json");
console.log(file);

fs.writeFile(file, JSON.stringify(finalTransformedData, null, 2), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Created new file successfully");
  }
});
