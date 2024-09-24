import { SortByRegionNumber } from "~/utils";
import { getAllTransplantData } from "./db.server";

// current is the initial date, previous is the day before, changing the terminology to apply to the other routes
export async function getChangeData(
  currentDate: string,
  previousDate: string,
  waitListType: string
) {
  const [currentData, previousData] = await Promise.all([
    getAllTransplantData(currentDate, waitListType),
    getAllTransplantData(previousDate, waitListType),
  ]);

  const sortedCurrentData = SortByRegionNumber(currentData);
  const sortedPreviousData = SortByRegionNumber(previousData);

  const N_REGIONS = 11;
  let changeDataList = [];

  // Compare current and previous date
  for (let i = 0; i < N_REGIONS; i++) {
    let change = changeData(sortedCurrentData[i], sortedPreviousData[i]);
    changeDataList.push(change);
  }

  return changeDataList;
}

export function changeData(regionDataToday: any, regionDataYesterday: any) {
  return [
    {
      ...regionDataToday,
      blood_type_a_change:
        regionDataToday?.blood_type_a - regionDataYesterday?.blood_type_a || 0,
      blood_type_b_change:
        regionDataToday?.blood_type_b - regionDataYesterday?.blood_type_b || 0,
      blood_type_o_change:
        regionDataToday?.blood_type_o - regionDataYesterday?.blood_type_o || 0,
      blood_type_ab_change:
        regionDataToday?.blood_type_ab - regionDataYesterday?.blood_type_ab ||
        0,
      blood_type_all_change:
        regionDataToday?.blood_type_all - regionDataYesterday?.blood_type_all ||
        0,
    },
  ];
}
