import "dotenv/config";
import { DateTime } from "luxon";
// Generated with CLI
import { DonorDataRecord, TransplantDataRecord, getXataClient } from "src/xata";
const xata = getXataClient();

const todaysDate = DateTime.now()
  .setZone("America/New_York")
  .toFormat("yyyy-MM-dd");
console.log(todaysDate);

// import * as transplantData from "./DatabaseWaitingList.json" assert { type: "json" };

import { readFile } from "fs/promises";
const transplantData = JSON.parse(
  await readFile(new URL("./DatabaseWaitingList.json", import.meta.url))
);

const transplantDataAdult = JSON.parse(
  await readFile(new URL("./DatabaseWaitingListAdult.json", import.meta.url))
);

const centerData = JSON.parse(
  await readFile(new URL("./CenterHeartCount.json", import.meta.url))
);

const donorData = JSON.parse(
  await readFile(new URL("./DatabaseDonorList.json", import.meta.url))
);

const datesData = JSON.parse(
  await readFile(new URL("./DataDates.json", import.meta.url))
);
// Delete Todays Data first in case needing to rerun

const records =
  await xata.sql<TransplantDataRecord>`DELETE FROM "transplant_data"
WHERE id IN (
    SELECT id
    FROM transplant_data
    WHERE "report_date" = ${todaysDate}
);`;
console.log(records);

const recordsAdult =
  await xata.sql<TransplantDataRecord>`DELETE FROM "transplant_data_adult"
WHERE id IN (
    SELECT id
    FROM transplant_data_adult
    WHERE "report_date" = ${todaysDate}
);`;
console.log(recordsAdult);

const records1 = await xata.sql<DonorDataRecord>`DELETE FROM "donor_data"
WHERE id IN (
    SELECT id
    FROM donor_data
    WHERE "report_date" = ${todaysDate}
);`;
console.log(records1);

const records2 = await xata.sql<TransplantDataRecord>`DELETE FROM "center_data"
WHERE id IN (
    SELECT id
    FROM center_data
    WHERE "report_date" = ${todaysDate}
);`;
console.log(records2);

// Insert Data

const dater = await xata.db.transplant_data.create(transplantData);

console.log(dater);

const adultData = await xata.db.transplant_data_adult.create(
  transplantDataAdult
);

console.log(adultData);

const center = await xata.db.center_data.create(centerData);

console.log(center);

const donors = await xata.db.donor_data.create(donorData);

console.log(donors);

// update data dates

const settingsRecord = await xata.db.settings.getFirst();

if (settingsRecord) {
  const dates = await xata.db.settings.update(settingsRecord?.id, {
    from_data_refresh_date: datesData.startDate,
    last_data_refresh_date: datesData.endDate,
    yesterday_from_data_refresh_date: settingsRecord.from_data_refresh_date,
    yesterday_last_data_refresh_date: settingsRecord.last_data_refresh_date,
  });
  console.log(dates);
} else {
  console.log("Settings Date Not Updated");
}
