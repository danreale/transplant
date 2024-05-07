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
  const { records } = await getXataClient()
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

export async function getTransplantCountDates(bloodType: "B" | "O") {
  const { records } = await getXataClient()
    .sql<TransplantDataRecord>`SELECT report_date,sum("heart_status_1A") FROM "transplant_data" where blood_type = ${bloodType} group by report_date order by report_date asc limit 365`;

  return records;
}

export async function getCenterData(date: string) {
  const transplantData = await getXataClient()
    .db.center_data.select(["heart", "report_date"])
    .filter({
      report_date: date,
    })
    .sort("report_date", "asc")
    .getAll();
  return transplantData;
}

export async function centerDataTotalsChart() {
  const transplantData = await getXataClient()
    .db.center_data.select(["heart", "report_date"])
    .sort("report_date", "asc")
    .getAll();
  return transplantData;
}

export async function getDonorData(date: string) {
  const donor_dataData = await getXataClient()
    .db.donor_data.select([
      "gender",
      "ethnicity",
      "blood_type_o",
      "blood_type_b",
      "report_date",
    ])
    .filter({
      report_date: date,
      ethnicity: "All Ethnicities",
    })
    .getAll();
  return donor_dataData;
}

export async function getDonorCountDatesB() {
  const { records } = await getXataClient()
    .sql<TransplantDataRecord>`SELECT report_date,sum("blood_type_b") as blood_type_b,sum("blood_type_o") as blood_type_o FROM "donor_data" where ethnicity = 'All Ethnicities' group by report_date order by report_date asc limit 365`;

  return records;
}
export async function getDonorCountDatesO() {
  const { records } = await getXataClient()
    .sql<TransplantDataRecord>`SELECT report_date,sum("blood_type_o") FROM "donor_data" where ethnicity = 'All Ethnicities' group by report_date order by report_date asc limit 365`;

  return records;
}
