import data from "temp.json";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";
import "dotenv/config";

import { getXataClient, TransplantDataRecord } from "src/xata";
import { RecordArray, SelectedPick } from "@xata.io/client";
const xata = getXataClient();

type MESSAGE = {
  count: number;
  change: "Added" | "Removed" | "Moved";
  bloodType: string;
  waitListType: string;
  waitListTime: string;
};

type BLOOD_TYPE_OBJ = {
  blood_type: string; //A
  today: number;
  yesterday: number;
  change: number;
};

type WAIT_LIST_OBJ = {
  type: string; // Status 1A
  wait_list_time: string; // <30 days
  blood_types: BLOOD_TYPE_OBJ[];
};
export type REGION_CHANGE_OBJ = {
  region: string;
  wait_list_types: WAIT_LIST_OBJ[];
  originalMessages: MESSAGE[];
  messages: MESSAGE[];
  movementMessages: MESSAGE[];
};
type MOVEMENT = {
  from: string;
  to: string;
  from_type: string;
  to_type: string;
};

enum VERB {
  DROPPED = "dropped",
  BUMPED = "bumped",
}
enum MOVEMENT_ACTION {
  ADDED = "Added",
  REMOVED = "Removed",
  MOVED = "Moved",
}

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
const bloodTypes = ["a", "b", "o", "ab", "all"];

const movements: Array<MOVEMENT> = [
  {
    from: "Heart Status 1A",
    from_type: "Removed",
    to: "Heart Status 1B",
    to_type: "Added",
  },
  {
    from: "Heart Status 1A",
    from_type: "Removed",
    to: "Heart Status 2",
    to_type: "Added",
  },
  {
    from: "Heart Status 1A",
    from_type: "Removed",
    to: "Heart Status 7 (Inactive)",
    to_type: "Added",
  },
  {
    from: "Heart Status 1B",
    from_type: "Removed",
    to: "Heart Status 2",
    to_type: "Added",
  },
  {
    from: "Heart Status 1B",
    from_type: "Removed",
    to: "Heart Status 7 (Inactive)",
    to_type: "Added",
  },
  {
    from: "Heart Status 2",
    from_type: "Removed",
    to: "Heart Status 7 (Inactive)",
    to_type: "Added",
  },
  {
    from: "Heart Status 7 (Inactive)",
    from_type: "Removed",
    to: "Heart Status 2",
    to_type: "Added",
  },
  {
    from: "Heart Status 7 (Inactive)",
    from_type: "Removed",
    to: "Heart Status 1B",
    to_type: "Added",
  },
  {
    from: "Heart Status 7 (Inactive)",
    from_type: "Removed",
    to: "Heart Status 1A",
    to_type: "Added",
  },
  {
    from: "Heart Status 2",
    from_type: "Removed",
    to: "Heart Status 1B",
    to_type: "Added",
  },
  {
    from: "Heart Status 2",
    from_type: "Removed",
    to: "Heart Status 1A",
    to_type: "Added",
  },
  {
    from: "Heart Status 1B",
    from_type: "Removed",
    to: "Heart Status 1A",
    to_type: "Added",
  },
];

export async function getDataFromDatabase(
  todaysDate: string,
  yesterdaysDate: string
) {
  // get todays data
  const recordsToday = await xata.db.transplant_data
    .filter({
      report_date: todaysDate,
      $not: {
        region: "All Regions",
      },
    })
    .getAll();

  // get yesterdays data
  const recordsYesterday = await xata.db.transplant_data
    .filter({
      report_date: yesterdaysDate,
      $not: {
        region: "All Regions",
      },
    })
    .getAll();

  return {
    todaysData: recordsToday,
    yesterdaysData: recordsYesterday,
  };
}

// Fill out missing data points

export async function calculateChangeData(
  todaysData: RecordArray<Readonly<SelectedPick<TransplantDataRecord, ["*"]>>>,
  yesterdaysData: RecordArray<
    Readonly<SelectedPick<TransplantDataRecord, ["*"]>>
  >
) {
  const regionChanges: Array<REGION_CHANGE_OBJ> = [];
  for (let index = 0; index < regions.length; index++) {
    const region = regions[index];

    const waitListData: Array<WAIT_LIST_OBJ> = [];
    let regionMessages: MESSAGE[] = [];

    for (let x = 0; x < waitListTypes.length; x++) {
      const waitListType = waitListTypes[x];

      for (let y = 0; y < waitListTimes.length; y++) {
        const waitListTime = waitListTimes[y];

        // get change data
        const td = todaysData
          .filter((d) => d.wait_list_time === waitListTime)
          .filter((d) => d.wait_list_type === waitListType)
          .filter((r) => r.region === region)[0];
        const yd = yesterdaysData
          .filter((d) => d.wait_list_time === waitListTime)
          .filter((d) => d.wait_list_type === waitListType)
          .filter((r) => r.region === region)[0];

        const bloodTypeChanges: BLOOD_TYPE_OBJ[] = [];

        for (let index = 0; index < bloodTypes.length; index++) {
          const bloodType = bloodTypes[index];

          const todayCount = td[`blood_type_${bloodType}`]!!;
          const yesterdayCount = yd[`blood_type_${bloodType}`]!!;
          const change = todayCount - yesterdayCount;

          bloodTypeChanges.push({
            blood_type: bloodType,
            today: todayCount,
            yesterday: yesterdayCount,
            change: change,
          });

          if (
            bloodType !== "all" &&
            waitListTime === "All Time" &&
            waitListType !== "All Types"
          ) {
            if (change > 0) {
              regionMessages.push({
                count: change,
                change: "Added",
                bloodType: bloodType,
                waitListType: waitListType,
                waitListTime: waitListTime,
              });
            } else if (change < 0) {
              regionMessages.push({
                count: Math.abs(change),
                change: "Removed",
                bloodType: bloodType,
                waitListType: waitListType,
                waitListTime: waitListTime,
              });
            }
          }
        }
        waitListData.push({
          type: waitListType,
          wait_list_time: waitListTime,
          blood_types: bloodTypeChanges,
        });
      }
    }

    // do processing here for movement messages
    const regionMovementMessages: MESSAGE[] = [];

    let regionMessagesCopy: MESSAGE[] = regionMessages;

    for (let index = 0; index < bloodTypes.length; index++) {
      const bloodType = bloodTypes[index];
      for (let m = 0; m < movements.length; m++) {
        const movement = movements[m];

        // filter out messages where the status from
        const status1 = regionMessages.filter(
          (r) =>
            r.waitListType === movement.from &&
            r.bloodType === bloodType &&
            movement.from_type === r.change
        );

        // filter out messages where the status to
        const status2 = regionMessages.filter(
          (r) =>
            r.waitListType === movement.to &&
            r.bloodType === bloodType &&
            movement.to_type === r.change
        );
        // both have some data
        if (status1.length > 0 && status2.length > 0) {
          // console.log("Region", region);
          // console.log("Status1", status1[0]);
          // console.log("Status2", status2[0]);

          // at this point we have a valid match and need to fifugre out the counts
          if (status1[0].count == status2[0].count) {
            // this is a valid movement.
            // add to movement messages
            // remove from messages
            const m: MESSAGE = {
              count: status1[0].count,
              change: "Moved",
              bloodType: bloodType,
              waitListType: `from ${movement.from} to ${movement.to}`,
              waitListTime: "All Time",
            };
            // console.log(m);
            regionMovementMessages.push(m);
            // remove items from messages
            regionMessagesCopy = regionMessagesCopy.filter(
              (r) =>
                !(
                  r.waitListType === movement.from &&
                  r.bloodType === bloodType &&
                  movement.from_type === r.change
                )
            );

            regionMessagesCopy = regionMessagesCopy.filter(
              (r) =>
                !(
                  r.waitListType === movement.to &&
                  r.bloodType === bloodType &&
                  movement.to_type === r.change
                )
            );
          } else {
            // still going to push a message, but we need to also leave the difference in count in the messages array
            const diff = Math.abs(status1[0].count - status2[0].count);
            // console.log("Diff", diff);
            // need to move the difference to the movements messages array
            // need to keep one in the messages array

            const status1Bigger = status1[0].count > status2[0].count;

            // push movement data
            const m: MESSAGE = {
              count: status1[0].count,
              change: "Moved",
              bloodType: bloodType,
              waitListType: `from ${movement.from} to ${movement.to}`,
              waitListTime: "All Time",
            };
            // console.log(m);
            regionMovementMessages.push(m);

            // remove items from messages
            regionMessagesCopy = regionMessagesCopy.filter(
              (r) =>
                !(
                  r.waitListType === movement.from &&
                  r.bloodType === bloodType &&
                  movement.from_type === r.change
                )
            );

            regionMessagesCopy = regionMessagesCopy.filter(
              (r) =>
                !(
                  r.waitListType === movement.to &&
                  r.bloodType === bloodType &&
                  movement.to_type === r.change
                )
            );
            // push status1 remainder back to region messages
            if (status1Bigger) {
              const m: MESSAGE = {
                count: diff,
                change: status1[0].change,
                bloodType: bloodType,
                waitListType: status1[0].waitListType,
                waitListTime: "All Time",
              };
              // console.log(m);
              regionMessagesCopy.push(m);
            }
            // push status2 remainder back to region messages
            else {
              const m: MESSAGE = {
                count: diff,
                change: status2[0].change,
                bloodType: bloodType,
                waitListType: status2[0].waitListType,
                waitListTime: "All Time",
              };
              // console.log(m);
              regionMessagesCopy.push(m);
            }
          }
        }
      }
    }

    regionChanges.push({
      region: region,
      wait_list_types: waitListData,
      originalMessages: regionMessages,
      messages: regionMessagesCopy,
      movementMessages: regionMovementMessages,
    });
  }
  return regionChanges;
}

async function main() {
  const { todaysData, yesterdaysData } = await getDataFromDatabase(
    // "2025-01-24",
    // "2025-01-23"
    // "2025-01-15",
    // "2025-01-14"
    // "2024-11-04",
    // "2024-11-03"
    "2025-01-27",
    "2025-01-26"
  );

  const calculatedChanges = await calculateChangeData(
    todaysData,
    yesterdaysData
  );

  fs.writeFile(
    "CalculatedChanges.json",
    JSON.stringify(calculatedChanges, null, 2),
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Created new file successfully");
      }
    }
  );

  fs.writeFile(
    "2024-11-04.json",
    JSON.stringify(todaysData, null, 2),
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Created new file successfully");
      }
    }
  );
  fs.writeFile(
    "2024-11-03.json",
    JSON.stringify(yesterdaysData, null, 2),
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
