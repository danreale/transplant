import { getSupabaseAdmin } from "./supabase.server";
import {
  WAIT_LIST_OBJ,
  Message,
  generateRegionMessages,
} from "./message-engine.server";

type TransplantDataRow = {
  region: string;
  report_date: string;
  wait_list_type: string;
  wait_list_time: string;
  blood_type_a: number | null;
  blood_type_b: number | null;
  blood_type_o: number | null;
  blood_type_ab: number | null;
  blood_type_all: number | null;
};

export type REGION_CHANGE_OBJ = {
  region: string;
  wait_list_types: WAIT_LIST_OBJ[];
  messages: Message[];
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

export async function getRealisticSmartChangeData(
  todaysDate: string,
  yesterdaysDate: string
) {
  const supabase = getSupabaseAdmin();
  const regionChanges: Array<REGION_CHANGE_OBJ> = [];

  const selectColumns =
    "region,report_date,wait_list_type,wait_list_time,blood_type_a,blood_type_b,blood_type_o,blood_type_ab,blood_type_all";

  // get todays data
  const { data: recordsTodayData, error: todayError } = await supabase
    .from("transplant_data")
    .select(selectColumns)
    .eq("report_date", todaysDate)
    .eq("wait_list_time", "All Time")
    .neq("region", "All Regions");
  if (todayError) throw todayError;
  const recordsToday: TransplantDataRow[] = recordsTodayData ?? [];

  // get yesterdays data
  const { data: recordsYesterdayData, error: yesterdayError } = await supabase
    .from("transplant_data")
    .select(selectColumns)
    .eq("report_date", yesterdaysDate)
    .eq("wait_list_time", "All Time")
    .neq("region", "All Regions");
  if (yesterdayError) throw yesterdayError;
  const recordsYesterday: TransplantDataRow[] = recordsYesterdayData ?? [];

  for (let index = 0; index < regions.length; index++) {
    const region = regions[index];

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

      // calculate changes for each blood type for each wait list type for each region
      // missing records (data pipeline gaps) and null counts both default to 0
      // rather than crashing the page
      const todayA = td?.blood_type_a ?? 0;
      const yesterdayA = yd?.blood_type_a ?? 0;
      const todayB = td?.blood_type_b ?? 0;
      const yesterdayB = yd?.blood_type_b ?? 0;
      const todayO = td?.blood_type_o ?? 0;
      const yesterdayO = yd?.blood_type_o ?? 0;
      const todayAb = td?.blood_type_ab ?? 0;
      const yesterdayAb = yd?.blood_type_ab ?? 0;
      const todayAll = td?.blood_type_all ?? 0;
      const yesterdayAll = yd?.blood_type_all ?? 0;

      waitListData.push({
        type: wlt,
        blood_types: [
          {
            blood_type: "a",
            today: todayA,
            yesterday: yesterdayA,
            change: todayA - yesterdayA,
          },
          {
            blood_type: "b",
            today: todayB,
            yesterday: yesterdayB,
            change: todayB - yesterdayB,
          },
          {
            blood_type: "o",
            today: todayO,
            yesterday: yesterdayO,
            change: todayO - yesterdayO,
          },
          {
            blood_type: "ab",
            today: todayAb,
            yesterday: yesterdayAb,
            change: todayAb - yesterdayAb,
          },
          {
            blood_type: "all",
            today: todayAll,
            yesterday: yesterdayAll,
            change: todayAll - yesterdayAll,
          },
        ],
      });
    }
    regionChanges.push({
      region: region,
      wait_list_types: waitListData,
      messages: generateRegionMessages(waitListData),
    });
  }

  return regionChanges;
}
