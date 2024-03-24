import { getXataClient } from "src/xata";
import { DateTime } from "luxon";

export async function getTransplantData(region: string, date: string) {
  // const todaysDate = DateTime.now()
  //   .setZone("America/New_York")
  //   .toFormat("yyyy-MM-dd");
  const formattedDate = DateTime.fromFormat(date, "yyyy-MM-dd")
    .setZone("America/New_York")
    .toISO();
  const transplantData = await getXataClient()
    .db.transplant_data.select([
      "blood_type",
      "heart_status_1A",
      "region",
      "report_date",
    ])
    .filter({
      region,
      report_date: formattedDate,
      blood_type: { $any: ["B", "O"] },
    })
    .sort("blood_type", "asc")
    .getAll();
  return transplantData;
}

export async function getTransplantDataWeek(wantedDate: string) {
  const formattedDate = DateTime.fromFormat(wantedDate, "yyyy-MM-dd").toISO();
  const transplantData = await getXataClient()
    .db.transplant_data.filter({
      report_date: formattedDate,
    })
    .getAll();
  return transplantData;

  // get first day of week data
  // get last day of week data

  // for each record, subtract last day of week minus the first day of the week data and show positive or negative trend
}

export async function bloodTypeTotals(bloodType: "B" | "O", date: string) {
  const formattedDate = DateTime.fromFormat(date, "yyyy-MM-dd").toISO();
  const records = await getXataClient().db.transplant_data.aggregate(
    {
      sumWaitlist: {
        sum: {
          column: "heart_status_1A",
        },
      },
    },
    { report_date: formattedDate, blood_type: bloodType }
  );
  return records;
}
