import "dotenv/config";

// Generated with CLI
import { DonorDataRecord, getXataClient, TransplantDataRecord } from "src/xata";
const xata = getXataClient();

// GET SPECIFIC DATE DATA IN DATABASE
const existing_date = "2025-06-24";

// INSERT DATE

const insert_dates = [
  "2025-06-25",
  "2025-06-26",
  "2025-06-27",
  "2025-06-28",
  "2025-06-29",
  "2025-06-30",
  "2025-07-01",
  "2025-07-02",
  "2025-07-03",
  "2025-07-04",
  "2025-07-05",
  "2025-07-06",
  "2025-07-07",
  "2025-07-08",
  "2025-07-09",
];
// const insert_date = "2025-07-07";

for (let index = 0; index < insert_dates.length; index++) {
  const insert_date = insert_dates[index];
  console.log(insert_date);

  //DELETE Existing Data
  const records =
    await xata.sql<TransplantDataRecord>`DELETE FROM "transplant_data"
  WHERE id IN (
      SELECT id
      FROM transplant_data
      WHERE "report_date" = ${insert_date}
  );`;
  console.log(records);

  const recordsAdult =
    await xata.sql<TransplantDataRecord>`DELETE FROM "transplant_data_adult"
  WHERE id IN (
      SELECT id
      FROM transplant_data_adult
      WHERE "report_date" = ${insert_date}
  );`;
  console.log(recordsAdult);

  const records1 = await xata.sql<DonorDataRecord>`DELETE FROM "donor_data"
  WHERE id IN (
      SELECT id
      FROM donor_data
      WHERE "report_date" = ${insert_date}
  );`;
  console.log(records1);

  const records2 =
    await xata.sql<TransplantDataRecord>`DELETE FROM "center_data"
  WHERE id IN (
      SELECT id
      FROM center_data
      WHERE "report_date" = ${insert_date}
  );`;
  console.log(records2);

  // INSERT Data

  // Pediatric Transplant Data
  const pediatricTransplantData = await xata.db.transplant_data
    .select([
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
      report_date: existing_date,
    })
    .getAll();

  const onlyRequiredData = pediatricTransplantData.map((x) => {
    return {
      report_date: insert_date,
      region: x.region,
      wait_list_type: x.wait_list_type,
      wait_list_time: x.wait_list_time,
      blood_type_a: x.blood_type_a,
      blood_type_b: x.blood_type_b,
      blood_type_ab: x.blood_type_ab,
      blood_type_o: x.blood_type_o,
      blood_type_all: x.blood_type_all,
    };
  });
  // console.log(onlyRequiredData);

  // Adult Transplant Data

  const adultTransplantData = await xata.db.transplant_data_adult
    .select([
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
      report_date: existing_date,
    })
    .getAll();

  const onlyRequiredDataAdult = adultTransplantData.map((x) => {
    return {
      report_date: insert_date,
      region: x.region,
      wait_list_type: x.wait_list_type,
      wait_list_time: x.wait_list_time,
      blood_type_a: x.blood_type_a,
      blood_type_b: x.blood_type_b,
      blood_type_ab: x.blood_type_ab,
      blood_type_o: x.blood_type_o,
      blood_type_all: x.blood_type_all,
    };
  });
  // console.log(onlyRequiredDataAdult);

  // Center Data
  const centerData = await xata.db.center_data
    .select(["heart", "report_date"])
    .filter({
      report_date: existing_date,
    })
    .getAll();

  const onlyRequiredDataCenter = centerData.map((x) => {
    return {
      report_date: insert_date,
      heart: x.heart,
    };
  });
  // console.log(onlyRequiredDataCenter);

  // Donor Data
  const donorData = await xata.db.donor_data
    .select([
      "gender",
      "ethnicity",
      "blood_type_o",
      "blood_type_b",
      "report_date",
    ])
    .filter({
      report_date: existing_date,
    })
    .getAll();

  const onlyRequiredDataDonor = donorData.map((x) => {
    return {
      report_date: insert_date,
      gender: x.gender,
      ethnicity: x.ethnicity,
      blood_type_o: x.blood_type_o,
      blood_type_b: x.blood_type_b,
    };
  });
  // console.log(onlyRequiredDataDonor);

  // INSERT DATA INTO DATABASE

  const dater = await xata.db.transplant_data.create(onlyRequiredData);

  console.log(`Pediatric Transplant Records: ${dater.length}`);

  const adultData = await xata.db.transplant_data_adult.create(
    onlyRequiredDataAdult
  );

  console.log(`Adult Transplant Records: ${adultData.length}`);

  const center = await xata.db.center_data.create(onlyRequiredDataCenter);

  console.log(`Center Records: ${center.length}`);

  const donors = await xata.db.donor_data.create(onlyRequiredDataDonor);

  console.log(`Donor Records: ${donors.length}`);
}
