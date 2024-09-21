import { TransplantDataRecord, getXataClient } from "src/xata";
import { DateTime } from "luxon";

export async function getTransplantData(
  region: string,
  date: string,
  waitListType: string
) {
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
      "region",
      "report_date",
      "wait_list_type",
      "wait_list_time",
      "blood_type_a",
      "blood_type_b",
      "blood_type_ab",
      "blood_type_o",
      "blood_type_all",
    ])
    .filter({
      region,
      report_date: date,
      wait_list_type: waitListType,
      wait_list_time: "All Time",
    })
    .sort("region", "asc")
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

export async function bloodTypeTotalsChart(region: string) {
  const records = await getXataClient()
    .db.transplant_data.select([
      "blood_type_a",
      "blood_type_ab",
      "blood_type_b",
      "blood_type_o",
      "report_date",
    ])
    .filter({
      wait_list_time: "All Time",
      wait_list_type: "All Types",
      region: region,
    })
    .sort("report_date", "asc")
    .getAll();
  return records;
}

export async function getTransplantCountDates() {
  const { records } = await getXataClient()
    .sql<TransplantDataRecord>`SELECT report_date, "blood_type_a", "blood_type_b", "blood_type_o", "blood_type_ab" FROM "transplant_data" where wait_list_time = 'All Time' and wait_list_type = 'All Types' and region = 'All Regions' order by report_date asc limit 365`;

  return records;
}

export async function getTransplantStatusCountDates(
  status:
    | "Heart Status 1A"
    | "Heart Status 1B"
    | "Heart Status 2"
    | "Heart Status 7 (Inactive)"
) {
  const { records } = await getXataClient()
    .sql<TransplantDataRecord>`SELECT report_date, SUM("blood_type_a" + "blood_type_b" + "blood_type_o" + "blood_type_ab") as wlt FROM "transplant_data" where wait_list_time = 'All Time' and wait_list_type = ${status} and region = 'All Regions' group by report_date order by report_date asc limit 365`;

  return records;
}
export async function getTransplantStatusCountDatesForRegion(
  status:
    | "Heart Status 1A"
    | "Heart Status 1B"
    | "Heart Status 2"
    | "Heart Status 7 (Inactive)",
  region: string
) {
  const usRegion = `Region  ${region}`;
  const { records } = await getXataClient()
    .sql<TransplantDataRecord>`SELECT report_date, SUM("blood_type_a" + "blood_type_b" + "blood_type_o" + "blood_type_ab") as wlt FROM "transplant_data" where wait_list_time = 'All Time' and wait_list_type = ${status} and region = ${usRegion} group by report_date order by report_date asc limit 365`;

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

export async function getAllTransplantData(date: string, waitListType: string) {
  const records = await getXataClient()
    .db.transplant_data.select([
      "region",
      "report_date",
      "wait_list_type",
      "wait_list_time",
      "blood_type_a",
      "blood_type_b",
      "blood_type_ab",
      "blood_type_o",
      "blood_type_all",
    ])
    .filter({
      report_date: date,
      $not: {
        region: "All Regions",
      },
      wait_list_time: "All Time",
      wait_list_type: waitListType,
    })
    .getAll();
  return records;
}

export async function getSettingsDates() {
  const dataRefreshDate = await getXataClient()
    .db.settings.select(["from_data_refresh_date", "last_data_refresh_date"])
    .getFirst();
  return dataRefreshDate;
}
