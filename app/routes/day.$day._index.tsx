import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { DateTime } from "luxon";

import Header from "~/components/Header";
import RegionDataV2 from "~/components/RegionDataV2";
import { getChangeData } from "~/data/change-data.server";
import { getCenterData } from "~/data/db.server";

export default function Appointments() {
  const {
    changeDataList,
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
  } = useLoaderData<typeof loader>();

  const params = useParams();

  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <Header />
      <h1 className="text-center text-4xl">Today's Data</h1>
      <h2 className="text-center text-4xl text-yellow-500 italic pb-2">
        {params.day}
      </h2>

      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-400 text-3xl pb-5">
          Transplant Data Loading.....
        </div>
      )}

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
              defaultValue={searchParams.get("waitListType") || "All Types"}
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

      <p className="text-center text-rose-500 font-bold py-5">
        {searchParams.get("waitListType")}
      </p>

      {/* Render Region Change Data */}
      {changeDataList.map((data, index) => (
        <RegionDataV2 transplantData={data} regionNumber={index + 1} key={`region-${index + 1}`} />
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
    </>
  );
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const waitListType = search.get("waitListType") as string

  // TODO: maybe should have a bail early error if bad date
  const providedDate = params.day!!;

  const dayBeforeProvidedDate = DateTime.fromFormat(params.day!!, "yyyy-MM-dd")
    .minus({ days: 1 })
    .toFormat("yyyy-MM-dd");

  const changeDataList = await getChangeData(providedDate, dayBeforeProvidedDate, waitListType)

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

  return {
    changeDataList,
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
  };
}
