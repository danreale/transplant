import "dotenv/config";
import { DateTime } from "luxon";
// Generated with CLI
import { getSupabaseAdmin } from "./app/data/supabase.server";
const supabase = getSupabaseAdmin();

const todaysDate = DateTime.now()
  .setZone("America/New_York")
  .toFormat("yyyy-MM-dd");
console.log(todaysDate);

// import * as transplantData from "./DatabaseWaitingList.json" assert { type: "json" };

import { readFile } from "fs/promises";
const transplantData = JSON.parse(
  await readFile(new URL("./WaitingList.json", import.meta.url))
);

const transplantDataAdult = JSON.parse(
  await readFile(new URL("./WaitingListAdult.json", import.meta.url))
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

const records = await supabase
  .from("transplant_data")
  .delete()
  .eq("report_date", todaysDate);
console.log(records);

const recordsAdult = await supabase
  .from("transplant_data_adult")
  .delete()
  .eq("report_date", todaysDate);
console.log(recordsAdult);

const records1 = await supabase
  .from("donor_data")
  .delete()
  .eq("report_date", todaysDate);
console.log(records1);

const records2 = await supabase
  .from("center_data")
  .delete()
  .eq("report_date", todaysDate);
console.log(records2);

// Insert Data

const dater = await supabase.from("transplant_data").insert(transplantData);

console.log(dater);

const adultData = await supabase
  .from("transplant_data_adult")
  .insert(transplantDataAdult);

console.log(adultData);

const center = await supabase.from("center_data").insert(centerData);

console.log(center);

const donors = await supabase.from("donor_data").insert(donorData);

console.log(donors);

// update data dates

const { data: settingsRecord } = await supabase
  .from("transplant_settings")
  .select("*")
  .limit(1)
  .single();

if (settingsRecord) {
  const { data: dates } = await supabase
    .from("transplant_settings")
    .update({
      from_data_refresh_date: datesData.startDate,
      last_data_refresh_date: datesData.endDate,
      yesterday_from_data_refresh_date: settingsRecord.from_data_refresh_date,
      yesterday_last_data_refresh_date: settingsRecord.last_data_refresh_date,
    })
    .eq("id", settingsRecord.id);
  console.log(dates);
} else {
  console.log("Settings Date Not Updated");
}
