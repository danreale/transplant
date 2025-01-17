import RegionDataV2 from "./RegionDataV2";
import { TimeBreakdown } from "~/utils";
import { REGION_CHANGE_OBJ } from "~/data/change-data-smart.server";

export default function RegionPageData({
  params,
  waitListTimeData,
  transplantDailyData,
}: {
  params: URLSearchParams;
  waitListTimeData: TimeBreakdown[];
  transplantDailyData: REGION_CHANGE_OBJ[];
}) {
  return (
    <>
      {transplantDailyData.map((data, index) => (
        <RegionDataV2
          regionNumber={index + 1}
          key={`region-${index + 1}`}
          timeData={waitListTimeData.filter(
            (d) => d.region === `Region  ${index + 1}`
          )}
          transplantData={data}
          waitListType={params.get("waitListType")!!}
        />
      ))}
    </>
  );
}
