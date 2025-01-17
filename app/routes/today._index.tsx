import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { DateTime } from "luxon";

import Header from "~/components/Header";
import RegionDataV2 from "~/components/RegionDataV2";
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
      <h1 className="text-center text-4xl">Today's Data</h1>
      <h2 className="text-center text-4xl text-yellow-500 italic font-semibold pb-2">
        {DateTime.fromFormat(
          params.get("reportDate") || todaysDate,
          "MM-dd-yyyy"
        ).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
      </h2>

      {isBetweenMidnightAndSeven() && (
        <p className="text-center font-semibold grid justify-center">
          <span className="italic">
            The current time is {currentTime.toFormat("h:mm a")}. Please check
            back after 8:00 am EST for updated data.*
          </span>
        </p>
      )}
      <p className="text-center font-semibold grid justify-center">
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
          <div className="grid justify-center text-center py-5">
            {/* <Form> */}
            <div className="grid justify-center text-center">
              <div className="grid justify-center text-center">
                <label htmlFor="" className="font-bold py-1">
                  Choose Wait List Type
                </label>
                <select
                  name="waitListType"
                  id="waitListType"
                  className="text-center"
                  defaultValue={params.get("waitListType") || "All Types"}
                  onChange={(e) => {
                    setSearchParams((prev) => {
                      prev.set("waitListType", e.target.value);
                      return prev;
                    });
                  }}
                >
                  <option value="Heart Status 1A">Heart Status 1A</option>
                  <option value="Heart Status 1B">Heart Status 1B</option>
                  <option value="Heart Status 2">Heart Status 2</option>
                  <option value="Heart Status 7 (Inactive)">
                    Heart Status 7 (Inactive)
                  </option>
                  <option value="All Types">All Types</option>
                </select>
              </div>

              {/* <button
              type="submit"
              className="text-blue-500 font-bold border-2 border-blue-500 rounded-xl"
            >
              Filter
            </button> */}
            </div>
            {/* </Form> */}
          </div>

      {/* Render Region Change Data */}
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

      <div className="py-5 text-center">
        <div className="grid justify-center text-center space-x-2">
          <label htmlFor="" className="">
            Today's Center Count:{" "}
            {todayCenterData[0]?.heart?.toString() || "NA"}
          </label>
          <label htmlFor="" className="">
            Yesterday's Center Count:{" "}
            {yesterdayCenterData[0]?.heart?.toString() || "NA"}
          </label>
        </div>
        <div className="flex justify-center text-center space-x-2">
          {todaysCenterChange === 0 && (
            <p className="text-yellow-600 font-bold">
              Center Change: ({todaysCenterChange})
            </p>
          )}
          {todaysCenterChange > 0 && (
            <p className="text-red-500 font-bold">
              Center Change: ({todaysCenterChange})
            </p>
          )}
          {todaysCenterChange < 0 && (
            <p className="text-green-500 font-bold">
              Center Change: ({todaysCenterChange})
            </p>
          )}
        </div>
      </div>

         
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
