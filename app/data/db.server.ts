import { TransplantDataRecord, getXataClient } from "src/xata";
import { DateTime } from "luxon";

export async function getTransplantData(region: string, date: string) {
  // const todaysDate = DateTime.now()
  //   .setZone("America/New_York")
  //   .toFormat("yyyy-MM-dd");
  // const formattedDate = DateTime.fromFormat(date, "yyyy-MM-dd")
  //   .setZone("America/New_York")
  //   .toUTC()
  //   .toISO();
  // console.log("Server Transplant Date From Client", date);
  const transplantData = await getXataClient()
    .db.transplant_data.select([
      "blood_type",
      "heart_status_1A",
      "region",
      "report_date",
    ])
    .filter({
      region,
      report_date: date,
      blood_type: { $any: ["B", "O"] },
    })
    .sort("blood_type", "asc")
    .getAll();
  return transplantData;
}

export async function bloodTypeTotals(bloodType: "B" | "O", date: string) {
  // const formattedDate = DateTime.fromFormat(date, "yyyy-MM-dd").toUTC().toISO();
  // console.log("Server Blood Type Date From Client", date);
  const records = await getXataClient().db.transplant_data.aggregate(
    {
      sumWaitlist: {
        sum: {
          column: "heart_status_1A",
        },
      },
    },
    { report_date: date, blood_type: bloodType }
  );
  return records;
}

export async function getTransplantDates() {
  const { records } = await await getXataClient()
    .sql<TransplantDataRecord>`SELECT distinct(report_date) FROM "transplant_data" order by report_date desc limit 365`;

  return records;
}

export async function bloodTypeTotalsChart(
  region: string,
  bloodType: "B" | "O"
) {
  const records = await getXataClient()
    .db.transplant_data.select(["heart_status_1A", "report_date"])
    .filter({ blood_type: bloodType, region: region })
    .sort("report_date", "asc")
    .getMany();
  return records;
}
