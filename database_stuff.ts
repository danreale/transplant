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

const centerData = JSON.parse(
  await readFile(new URL("./CenterHeartCount.json", import.meta.url))
);

const donorData = JSON.parse(
  await readFile(new URL("./DatabaseDonorList.json", import.meta.url))
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

const center = await xata.db.center_data.create(centerData);

console.log(center);

const donors = await xata.db.donor_data.create(donorData);

console.log(donors);
