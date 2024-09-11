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

const todaysDate = DateTime.now()
  .setZone("America/New_York")
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
      <h1 className="text-center text-4xl">Today's Data</h1>
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
  const search = new URLSearchParams(url.search);
  const waitListType = search.get("waitListType") as string

  const todaysDate = DateTime.now()
    .setZone("America/New_York")
    .toFormat("yyyy-MM-dd");
  // console.log("Loader Transplant Date", todaysDate);

  const N_REGIONS = 11
  let regionPromises = []

  for (let i = 0; i < N_REGIONS; i++) {
    regionPromises.push(
      getTransplantData(
        `Region  ${i + 1}`,
        todaysDate,
        waitListType
      ))
  }

  const yesterdaysDate = DateTime.now()
    .setZone("America/New_York")
    .minus({ days: 1 })
    .toFormat("yyyy-MM-dd");

  for (let i = 0; i < N_REGIONS; i++) {
    regionPromises.push(
      getTransplantData(
        `Region  ${i + 1}`,
        yesterdaysDate,
        waitListType
      ))
  }

  // resolve all of today and yesterday together
  const data = await Promise.all(regionPromises)

  // split the first 11 to today, and last 11 to yesterday
  const regionDataToday = data.slice(0, 11)
  const regionDataYesterday = data.slice(11)

  const changeData = (regionDataToday: any, regionDataYesterday: any) => {
    return [
      {
        ...regionDataToday[0],
        blood_type_a_change:
          regionDataToday[0].blood_type_a -
          regionDataYesterday[0]?.blood_type_a || 0,
        blood_type_b_change:
          regionDataToday[0].blood_type_b -
          regionDataYesterday[0]?.blood_type_b || 0,
        blood_type_o_change:
          regionDataToday[0].blood_type_o -
          regionDataYesterday[0]?.blood_type_o || 0,
        blood_type_ab_change:
          regionDataToday[0].blood_type_ab -
          regionDataYesterday[0]?.blood_type_ab || 0,
        blood_type_all_change:
          regionDataToday[0].blood_type_all -
          regionDataYesterday[0]?.blood_type_all || 0,
      },
    ];
  };

  let changeDataList = []

  for (let i = 0; i < N_REGIONS; i++) {
    let change = changeData(regionDataToday[i], regionDataYesterday[i])
    changeDataList.push(change)
  }

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

  return {
    changeDataList,
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
  };
}
