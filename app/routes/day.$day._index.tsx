import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
  useParams,
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
} from "~/data/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Heart Transplant Waiting List - Daily" },
    { name: "description", content: "Daily Waiting List Data" },
  ];
};

export default function Daily() {
  const {
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
    waitListTimeData,
    transplantDailyData,
  } = useLoaderData<typeof loader>();

  const params = useParams();

  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div>
      <Header />
      <h1 className="text-center text-4xl" data-testid="page-heading">
        Day's Data
      </h1>
      <h2 className="text-center text-4xl text-yellow-500 italic font-semibold pb-2">
        {DateTime.fromFormat(params.day!!, "yyyy-MM-dd").toLocaleString(
          DateTime.DATE_MED_WITH_WEEKDAY
        )}
      </h2>

      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-400 text-3xl pb-5">
          Transplant Data Loading.....
        </div>
      )}

      <FilterWaitListType params={searchParams} />

      <RegionPageData
        params={searchParams}
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

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const waitListType = search.get("waitListType") as string;

  // TODO: maybe should have a bail early error if bad date
  const providedDate = params.day!!;

  const dayBeforeProvidedDate = DateTime.fromFormat(params.day!!, "yyyy-MM-dd")
    .minus({ days: 1 })
    .toFormat("yyyy-MM-dd");

  const todayCenterData = await getCenterData(providedDate);
  const yesterdayCenterData = await getCenterData(dayBeforeProvidedDate);

  const centerChange = () => {
    if (yesterdayCenterData.length === 0 || todayCenterData.length === 0) {
      return 0;
    } else {
      return todayCenterData[0].heart!! - yesterdayCenterData[0].heart!!;
    }
  };

  const todaysCenterChange = centerChange();

  const waitListTimeData = await getAllTransplantDataWithWaitListTime(
    providedDate,
    waitListType
  );

  const transplantDailyData = await getRealisticSmartChangeData(
    params.day!!,
    dayBeforeProvidedDate
  );

  return {
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
    waitListTimeData,
    transplantDailyData,
  };
}
