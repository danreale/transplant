import { getXataClient } from "src/xata";
const xata = getXataClient();

type BLOOD_TYPE_OBJ = {
  blood_type: string;
  today: number;
  yesterday: number;
  change: number;
};

type WAIT_LIST_OBJ = {
  type: string;
  blood_types: BLOOD_TYPE_OBJ[];
};
export type REGION_CHANGE_OBJ = {
  region: string;
  wait_list_types: WAIT_LIST_OBJ[];
  messages: [];
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

const wlts = [
  "Heart Status 1A",
  "Heart Status 1B",
  "Heart Status 2",
  "Heart Status 7 (Inactive)",
  "All Types",
];
const bloodTypes = ["a", "b", "o", "ab"];

export async function getRealisticSmartChangeData(
  todaysDate: string,
  yesterdaysDate: string
) {
  const regionChanges: Array<REGION_CHANGE_OBJ> = [];
  // get todays data
  const recordsToday = await xata.db.transplant_data
    .filter({
      report_date: todaysDate,
      $not: {
        region: "All Regions",
      },
      wait_list_time: "All Time",
    })
    .getAll();
  console.log("TodaysRecords", recordsToday);

  // get yesterdays data
  const recordsYesterday = await xata.db.transplant_data
    .filter({
      report_date: yesterdaysDate,
      $not: {
        region: "All Regions",
      },
      wait_list_time: "All Time",
    })
    .getAll();
  //   console.log("YesterdaysRecords", recordsYesterday);

  for (let index = 0; index < regions.length; index++) {
    const region = regions[index];
    // console.log(region);

    const waitListData: Array<WAIT_LIST_OBJ> = [];
    // for each wait list type for each region, filter the data out so it can be further processed for blood type change comparisons
    for (let index = 0; index < wlts.length; index++) {
      const wlt = wlts[index];
      const td = recordsToday
        .filter((d) => d.wait_list_type === wlt)
        .filter((r) => r.region === region)[0];
      const yd = recordsYesterday
        .filter((d) => d.wait_list_type === wlt)
        .filter((r) => r.region === region)[0];
      //   console.log(wlt);
      //   console.log("Todays Data", td);
      //   console.log("Yesterdays Data", yd);

      // calculate changes for each blood type for each wait list type for each region
      const aChange = td.blood_type_a!! - yd.blood_type_a!!;
      const bChange = td.blood_type_b!! - yd.blood_type_b!!;
      const oChange = td.blood_type_o!! - yd.blood_type_o!!;
      const abChange = td.blood_type_ab!! - yd.blood_type_ab!!;
      const allChange = td.blood_type_all!! - yd.blood_type_all!!;
      //   console.log("a", aChange);
      //   console.log("b", bChange);
      //   console.log("o", oChange);
      //   console.log("ab", abChange);
      //   console.log("all", allChange);

      waitListData.push({
        type: wlt,
        blood_types: [
          {
            blood_type: "a",
            today: td.blood_type_a!!,
            yesterday: yd.blood_type_a!!,
            change: aChange,
          },
          {
            blood_type: "b",
            today: td.blood_type_b!!,
            yesterday: yd.blood_type_b!!,
            change: bChange,
          },
          {
            blood_type: "o",
            today: td.blood_type_o!!,
            yesterday: yd.blood_type_o!!,
            change: oChange,
          },
          {
            blood_type: "ab",
            today: td.blood_type_ab!!,
            yesterday: yd.blood_type_ab!!,
            change: abChange,
          },
          {
            blood_type: "all",
            today: td.blood_type_all!!,
            yesterday: yd.blood_type_all!!,
            change: allChange,
          },
        ],
      });
    }
    regionChanges.push({
      region: region,
      wait_list_types: waitListData,
      messages: [],
    });
  }
  //   console.log("Region Changes", regionChanges);

  // after looping through the data, now analyze it
  // analyze the data and make predictions about the data based on the changes.
  const regionChangesWithMessages = regionChanges;

  function applyMessages(
    region: string,
    status1: WAIT_LIST_OBJ,
    status2: WAIT_LIST_OBJ,
    bloodType: string,
    message: string
  ) {
    if (
      status2.blood_types.filter((bt) => bt.blood_type === bloodType)[0]
        .change > 0 &&
      status1.blood_types.filter((bt) => bt.blood_type === bloodType)[0]
        .change < 0

      // compare today vs yesterday wait list times to check what the differences are and add that to the message.
    ) {
      regionChangesWithMessages
        .filter((r) => r.region === region)[0]
        .messages.push(`${bloodType.toUpperCase()} - ${message}`);
    }
  }

  function applyTransplantMessage(
    region: string,
    status1: Array<BLOOD_TYPE_OBJ>
  ) {
    const summer = status1.reduce(
      (accumulator, currentValue) => accumulator + currentValue.change,
      0
    );
    // console.log("Summer", summer);
    if (summer >= 2) {
      regionChangesWithMessages
        .filter((r) => r.region === region)[0]
        .messages.push(`Patient Added To Waiting List`);
    }
    if (summer <= -2) {
      regionChangesWithMessages
        .filter((r) => r.region === region)[0]
        .messages.push(`Patient Received Transplant`);
    }
  }

  for (let x = 0; x < regions.length; x++) {
    const region = regions[x];

    for (let index = 0; index < bloodTypes.length; index++) {
      const bt = bloodTypes[index];
      // console.log(bt);

      // LOOKING AT CHANGES BETWEEN 1A to 1B
      const a = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 1A")[0];
      const b = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 1B")[0];
      applyMessages(
        region,
        a,
        b,
        bt,
        "1A Patient might have dropped to Status 1B"
      );

      // LOOKING AT CHANGES BETWEEN 1A to 2
      const a1 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 1A")[0];
      const b1 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 2")[0];
      applyMessages(
        region,
        a1,
        b1,
        bt,
        "1A Patient might have dropped to Status 2"
      );

      // LOOKING AT CHANGES BETWEEN 1A to 7
      const a2 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 1A")[0];
      const b2 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter(
          (d) => d.type === "Heart Status 7 (Inactive)"
        )[0];
      applyMessages(
        region,
        a2,
        b2,
        bt,
        "1A Patient might have dropped to Status 7"
      );

      // LOOKING AT CHANGES BETWEEN 1B to 1A
      const a3 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 1B")[0];
      const b3 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 1A")[0];
      applyMessages(
        region,
        a3,
        b3,
        bt,
        "1B Patient might have been bumped to Status 1A"
      );

      // LOOKING AT CHANGES BETWEEN 1B to 2
      const a4 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 1B")[0];
      const b4 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 2")[0];
      applyMessages(
        region,
        a4,
        b4,
        bt,
        "1B Patient might have dropped to Status 2"
      );

      // LOOKING AT CHANGES BETWEEN 1B to 7
      const a5 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 1B")[0];
      const b5 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter(
          (d) => d.type === "Heart Status 7 (Inactive)"
        )[0];
      applyMessages(
        region,
        a5,
        b5,
        bt,
        "1B Patient might have dropped to Status 7"
      );

      // LOOKING AT CHANGES BETWEEN 2 to 7
      const a6 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 2")[0];
      const b6 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter(
          (d) => d.type === "Heart Status 7 (Inactive)"
        )[0];
      applyMessages(
        region,
        a6,
        b6,
        bt,
        "Status 2 Patient might have dropped to Status 7 (Inctive)"
      );

      // LOOKING AT CHANGES BETWEEN 2 to 1B
      const a7 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 2")[0];
      const b7 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 1B")[0];
      applyMessages(
        region,
        a7,
        b7,
        bt,
        "Status 2 Patient might have bumped to Status 1B"
      );

      // LOOKING AT CHANGES BETWEEN 2 to 1A
      const a8 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 2")[0];
      const b8 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 1A")[0];
      applyMessages(
        region,
        a8,
        b8,
        bt,
        "Status 2 Patient might have bumped to Status 1A"
      );

      // LOOKING AT CHANGES BETWEEN 7 to 2
      const a9 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter(
          (d) => d.type === "Heart Status 7 (Inactive)"
        )[0];
      const b9 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 2")[0];
      applyMessages(
        region,
        a9,
        b9,
        bt,
        "Status 7 Patient might have bumped to Status 2"
      );

      // LOOKING AT CHANGES BETWEEN 7 to 1B
      const a10 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter(
          (d) => d.type === "Heart Status 7 (Inactive)"
        )[0];
      const b10 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 1B")[0];
      applyMessages(
        region,
        a10,
        b10,
        bt,
        "Status 7 Patient might have bumped to Status 1B"
      );

      // LOOKING AT CHANGES BETWEEN 7 to 1A
      const a11 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter(
          (d) => d.type === "Heart Status 7 (Inactive)"
        )[0];
      const b11 = regionChanges
        .filter((r) => r.region === region)[0]
        .wait_list_types.filter((d) => d.type === "Heart Status 1A")[0];
      applyMessages(
        region,
        a11,
        b11,
        bt,
        "Status 7 Patient might have bumped to Status 1A"
      );
    }
    // CHECK FOR POSSIBLE TRANSPLANTS
    const a20 = regionChanges
      .filter((r) => r.region === region)[0]
      .wait_list_types.filter(
        (d) => d.type === "Heart Status 1A"
      )[0].blood_types;
    const a21 = regionChanges
      .filter((r) => r.region === region)[0]
      .wait_list_types.filter(
        (d) => d.type === "Heart Status 1B"
      )[0].blood_types;
    const a22 = regionChanges
      .filter((r) => r.region === region)[0]
      .wait_list_types.filter(
        (d) => d.type === "Heart Status 2"
      )[0].blood_types;
    const a23 = regionChanges
      .filter((r) => r.region === region)[0]
      .wait_list_types.filter(
        (d) => d.type === "Heart Status 7 (Inactive)"
      )[0].blood_types;

    const regionWaitListTypesFlat = [a20, a21, a22, a23].flat();
    // console.log("Flatter", regionWaitListTypesFlat);

    applyTransplantMessage(region, regionWaitListTypesFlat);
  }
  //   console.log(regionChangesWithMessages);
  return regionChangesWithMessages;
}

export type baseObj = {
  region: string;
  report_date: string;
  wait_list_type: string;
  wait_list_time: string;
  blood_type_a: number;
  blood_type_b: number;
  blood_type_ab: number;
  blood_type_o: number;
  blood_type_all: number;
};

type BLOOD_TYPE_OBJ_V2 = {
  wait_list_time: string; // <30 days
  blood_type: string; //A
  today: number;
  yesterday: number;
  change: number;
};

type WAIT_LIST_OBJ_V2 = {
  type: string; // Status 1A
  wait_times: BLOOD_TYPE_OBJ[];
};
export type REGION_CHANGE_OBJ_V2 = {
  region: string;
  wait_list_types: WAIT_LIST_OBJ_V2[];
  messages: [];
};
