import { RecordArray, SelectedPick } from "@xata.io/client";
import { TransplantDataRecord } from "src/xata";

import todaysData from "./Jan27.json";
import yesterdaysData from "./Jan26.json";

import fs from "fs";

type MESSAGE = {
  count: number;
  change: "Added" | "Removed" | "Moved";
  bloodType: string;
  waitListType: string; // Include waitListType
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
type REGION_CHANGE_OBJ = {
  region: string;
  wait_list_types: WAIT_LIST_OBJ[];
  messages: MESSAGE[];
  movementMessages: MESSAGE[];
};

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
const bloodTypes = ["a", "b", "o", "ab"];

const validMovements = [
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

function analyzeData(
  todayData: RecordArray<Readonly<SelectedPick<TransplantDataRecord, ["*"]>>>,
  yesterdayData: RecordArray<
    Readonly<SelectedPick<TransplantDataRecord, ["*"]>>
  >
): REGION_CHANGE_OBJ[] {
  const regionChanges: REGION_CHANGE_OBJ[] = [];

  regions.forEach((region) => {
    const regionDataToday = todayData.filter((item) => item.region === region);
    const regionDataYesterday = yesterdayData.filter(
      (item) => item.region === region
    );

    const waitListTypeChanges: WAIT_LIST_OBJ[] = [];
    let regionMessages: MESSAGE[] = [];
    // const regionMovementMessages: MESSAGE[] = [];

    waitListTypes.forEach((waitListType) => {
      if (waitListType === "All Types") {
        return; // Skip "All Types"
      }

      const waitListTypeDataToday = regionDataToday.filter(
        (item) => item.wait_list_type === waitListType
      );
      const waitListTypeDataYesterday = regionDataYesterday.filter(
        (item) => item.wait_list_type === waitListType
      );

      const allTimeDataToday = waitListTypeDataToday.filter(
        (item) => item.wait_list_time === "All Time"
      );
      const allTimeDataYesterday = waitListTypeDataYesterday.filter(
        (item) => item.wait_list_time === "All Time"
      );

      const bloodTypeChanges: BLOOD_TYPE_OBJ[] = [];

      bloodTypes.forEach((bloodType) => {
        const todayCount = allTimeDataToday.reduce(
          (sum, item) =>
            sum + (item[`blood_type_${bloodType}` as keyof DataEntry] || 0),
          0
        );
        const yesterdayCount = allTimeDataYesterday.reduce(
          (sum, item) =>
            sum + (item[`blood_type_${bloodType}` as keyof DataEntry] || 0),
          0
        );
        const change = todayCount - yesterdayCount;

        bloodTypeChanges.push({
          blood_type: bloodType.toUpperCase(),
          today: todayCount,
          yesterday: yesterdayCount,
          change: change,
        });

        if (change > 0) {
          regionMessages.push({
            count: change,
            change: "Added",
            bloodType: bloodType.toUpperCase(),
            waitListType: waitListType,
          });
        } else if (change < 0) {
          regionMessages.push({
            count: Math.abs(change),
            change: "Removed",
            bloodType: bloodType.toUpperCase(),
            waitListType: waitListType,
          });
        }
      });

      waitListTypeChanges.push({
        type: waitListType,
        wait_list_time: "All Time",
        blood_types: bloodTypeChanges,
      });
    });

    // Process messages to identify movements (Corrected Logic):
    const processedMessages: MESSAGE[] = [];
    const regionMovementMessages: MESSAGE[] = [];

    while (regionMessages.length > 0) {
      const message = regionMessages.shift()!;

      if (message.change === "Added") {
        const matchingRemovals = regionMessages.filter(
          (m) => m.change === "Removed" && m.bloodType === message.bloodType
        );

        if (matchingRemovals.length > 0) {
          let countToAdd = message.count;
          let moved = false;

          const removalsCopy = matchingRemovals.map((r) => ({ ...r }));

          for (const removal of removalsCopy) {
            const isValidMove = validMovements.some(
              (move) =>
                move.from === removal.waitListType &&
                move.from_type === removal.change &&
                move.to === message.waitListType &&
                move.to_type === message.change
            );

            if (isValidMove) {
              const moveCount = Math.min(countToAdd, removal.count);
              if (moveCount > 0) {
                regionMovementMessages.push({
                  count: moveCount,
                  change: "Moved",
                  bloodType: message.bloodType,
                  waitListType: `${removal.waitListType} to ${message.waitListType}`,
                });

                countToAdd -= moveCount;
                removal.count -= moveCount;

                moved = true;

                regionMessages = regionMessages.filter(
                  (m) =>
                    !(
                      m.change === "Removed" &&
                      m.bloodType === removal.bloodType &&
                      m.waitListType === removal.waitListType &&
                      m.count === 0
                    )
                );

                if (countToAdd === 0) break;
              }
            }
          }
          if (countToAdd > 0 || !moved) {
            processedMessages.push({ ...message, count: countToAdd });
          }
        } else {
          processedMessages.push(message);
        }
      } else {
        processedMessages.push(message);
      }
    }

    regionChanges.push({
      region: region,
      wait_list_types: waitListTypeChanges,
      messages: processedMessages,
      movementMessages: regionMovementMessages,
    });
  });

  return regionChanges;
}
// Example usage (replace with your actual data):

const analysisResults = analyzeData(todaysData, yesterdaysData);
// console.log(JSON.stringify(analysisResults, null, 2));
fs.writeFile(
  "TestConditionChangeData2.json",
  JSON.stringify(analysisResults, null, 2),
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Created new file successfully");
    }
  }
);
