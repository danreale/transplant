import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  getAllTransplantDataWithWaitListTime,
  getCenterData,
  getSettingsDates,
} from "~/data/db.server";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { DateTime } from "luxon";
import Header from "~/components/Header";
import RegionDataV2 from "~/components/RegionDataV2";
import { getChangeData } from "~/data/change-data.server";
import { getRealisticSmartChangeData } from "~/data/change-data-smart.server";
import CenterData from "~/components/CenterData";
import FilterWaitListType from "~/components/FilterWaitListType";
import RegionPageData from "~/components/RegionPageData";

const todaysDate = DateTime.now()
  .setZone("America/New_York")
  .minus({ days: 1 })
  .toFormat("MM-dd-yyyy");

export const meta: MetaFunction = () => {
  return [
    { title: "Heart Transplant Waiting List - Yesterday" },
    { name: "description", content: "Yesterdays Waiting List Data" },
  ];
};

export default function Yesterday() {
  const {
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
    waitListTimeData,
    settingsDates,
    transplantDailyData,
  } = useLoaderData<typeof loader>();

  const [params] = useSearchParams();

  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const [, setSearchParams] = useSearchParams();

  return (
    <div>
      <Header />
      <h1 className="text-center text-4xl" data-testid="page-heading">
        Yesterday's Data
      </h1>
      <h2 className="text-center text-4xl text-yellow-500 italic font-semibold pb-2">
        {DateTime.fromFormat(
          params.get("reportDate") || todaysDate,
          "MM-dd-yyyy"
        ).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
      </h2>

      <p className="text-center font-semibold grid justify-center">
        <span className="italic">*Based on data through</span>
        <span className="italic">
          {DateTime.fromFormat(
            settingsDates?.yesterday_last_data_refresh_date!!,
            "yyyy-MM-dd"
          ).toFormat("DDDD")}
          *
        </span>
      </p>

      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-400 text-3xl pb-5">
          Transplant Data Loading.....
        </div>
      )}

      <FilterWaitListType params={params} />

      <RegionPageData
        params={params}
        waitListTimeData={waitListTimeData}
        transplantDailyData={transplantDailyData}
      />

      <CenterData
        todayCenterData={todayCenterData}
        yesterdayCenterData={yesterdayCenterData}
        todaysCenterChange={todaysCenterChange}
      />
    </div>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const waitListType = search.get("waitListType") as string;

  const yesterdaysDate = DateTime.now()
    .setZone("America/New_York")
    .minus({ days: 1 })
    .toFormat("yyyy-MM-dd");

  const dayBeforeYesterdayDate = DateTime.now()
    .setZone("America/New_York")
    .minus({ days: 2 })
    .toFormat("yyyy-MM-dd");

  const todayCenterData = await getCenterData(yesterdaysDate);
  const yesterdayCenterData = await getCenterData(dayBeforeYesterdayDate);

  const centerChange = () => {
    if (yesterdayCenterData.length === 0 || todayCenterData.length === 0) {
      return 0;
    } else {
      return todayCenterData[0].heart!! - yesterdayCenterData[0].heart!!;
    }
  };
  const todaysCenterChange = centerChange();

  const waitListTimeData = await getAllTransplantDataWithWaitListTime(
    yesterdaysDate,
    waitListType
  );
  const settingsDates = await getSettingsDates();

  const transplantDailyData = await getRealisticSmartChangeData(
    yesterdaysDate,
    dayBeforeYesterdayDate
  );

  return {
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
    waitListTimeData,
    settingsDates,
    transplantDailyData,
  };
}
