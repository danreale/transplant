import { LoaderFunctionArgs } from "@remix-run/node";
import { getCenterData, getTransplantData } from "~/data/db.server";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { DateTime } from "luxon";
import Header from "~/components/Header";
import RegionDataV2 from "~/components/RegionDataV2";
import { getChangeData } from "~/data/change-data.server";

const todaysDate = DateTime.now()
  .setZone("America/New_York")
  .minus({ days: 1 })
  .toFormat("MM-dd-yyyy");
export default function Appointments() {
  const {
    changeDataList,
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
  } = useLoaderData<typeof loader>();

  const [params] = useSearchParams();

  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const [, setSearchParams] = useSearchParams();

  return (
    <>
      <Header />
      <h1 className="text-center text-4xl">Yesterday's Data</h1>
      <h2 className="text-center text-4xl text-yellow-500 italic pb-2">
        {params.get("reportDate") || todaysDate}
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

      <p className="text-center text-rose-500 font-bold py-5">
        {params.get("waitListType")}
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

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search)
  const waitListType = search.get("waitListType") as string

  const yesterdaysDate = DateTime.now()
    .setZone("America/New_York")
    .minus({ days: 1 })
    .toFormat("yyyy-MM-dd");

  const dayBeforeYesterdayDate = DateTime.now()
    .setZone("America/New_York")
    .minus({ days: 2 })
    .toFormat("yyyy-MM-dd");

  const changeDataList = await getChangeData(yesterdaysDate, dayBeforeYesterdayDate, waitListType)

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

  return {
    changeDataList,
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
  };
}
