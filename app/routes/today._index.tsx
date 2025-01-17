import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { DateTime } from "luxon";
import CenterData from "~/components/CenterData";
import FilterWaitListType from "~/components/FilterWaitListType";

import Header from "~/components/Header";
import RegionDataV2 from "~/components/RegionDataV2";
import RegionPageData from "~/components/RegionPageData";
import { getRealisticSmartChangeData } from "~/data/change-data-smart.server";
import { getChangeData } from "~/data/change-data.server";
import {
  getAllTransplantDataWithWaitListTime,
  getCenterData,
  getSettingsDates,
} from "~/data/db.server";
import { isBetweenMidnightAndSeven } from "~/utils";

const todaysDate = DateTime.now()
  .setZone("America/New_York")
  .toFormat("MM-dd-yyyy");

export const meta: MetaFunction = () => {
  return [
    { title: "Heart Transplant Waiting List - Today" },
    { name: "description", content: "Todays Waiting List Data" },
  ];
};

export default function Today() {
  const {
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
    settingsDates,
    waitListTimeData,
    transplantDailyData,
  } = useLoaderData<typeof loader>();

  const [params] = useSearchParams();

  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const [, setSearchParams] = useSearchParams();

  const currentTime = DateTime.now().setZone("America/New_York");

  return (
    <div>
      <Header />
      <h1 className="text-center text-4xl" data-testid="page-heading">
        Today's Data
      </h1>
      <h2
        className="text-center text-4xl text-yellow-500 italic font-semibold pb-2"
        data-testid="todaysDate"
      >
        {DateTime.fromFormat(
          params.get("reportDate") || todaysDate,
          "MM-dd-yyyy"
        ).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
      </h2>

      {isBetweenMidnightAndSeven() && (
        <p
          className="text-center font-semibold grid justify-center"
          data-testid="noDataMessage"
        >
          <span className="italic">
            The current time is {currentTime.toFormat("h:mm a")}. Please check
            back after 8:00 am EST for updated data.*
          </span>
        </p>
      )}
      <p
        className="text-center font-semibold grid justify-center"
        data-testid="refreshDate"
      >
        <span className="italic">*Based on data through</span>
        <span className="italic">
          {DateTime.fromFormat(
            settingsDates?.last_data_refresh_date!!,
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

      {!isBetweenMidnightAndSeven() && (
        <>
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
        </>
      )}
    </div>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const waitListType = search.get("waitListType") as string;

  const todaysDate = DateTime.now()
    .setZone("America/New_York")
    .toFormat("yyyy-MM-dd");

  const yesterdaysDate = DateTime.now()
    .setZone("America/New_York")
    .minus({ days: 1 })
    .toFormat("yyyy-MM-dd");

  const todayCenterData = await getCenterData(todaysDate);
  const yesterdayCenterData = await getCenterData(yesterdaysDate);

  const centerChange = () => {
    if (yesterdayCenterData.length === 0 || todayCenterData.length === 0) {
      return 0;
    } else {
      return todayCenterData[0].heart!! - yesterdayCenterData[0].heart!!;
    }
  };

  const todaysCenterChange = centerChange();

  const settingsDates = await getSettingsDates();

  const waitListTimeData = await getAllTransplantDataWithWaitListTime(
    todaysDate,
    waitListType
  );

  const transplantDailyData = isBetweenMidnightAndSeven()
    ? []
    : await getRealisticSmartChangeData(todaysDate, yesterdaysDate);

  // console.log(transplantDailyData);

  return {
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
    settingsDates,
    waitListTimeData,
    transplantDailyData,
  };
}
