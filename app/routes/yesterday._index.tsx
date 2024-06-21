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
  .minus({ days: 1 })
  .toFormat("MM-dd-yyyy");
export default function Appointments() {
  const {
    region1ChangeData,
    region2ChangeData,
    region3ChangeData,
    region4ChangeData,
    region5ChangeData,
    region6ChangeData,
    region7ChangeData,
    region8ChangeData,
    region9ChangeData,
    region10ChangeData,
    region11ChangeData,
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
  } = useLoaderData<typeof loader>();

  const [params] = useSearchParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
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

      <div className="text-blue-600">
        <RegionDataV2 transplantData={region1ChangeData} region={"Region  1"} />
      </div>
      <div className="text-red-600 font-bold">
        <RegionDataV2 transplantData={region2ChangeData} region={"Region  2"} />
      </div>
      <div className="text-blue-600">
        <RegionDataV2 transplantData={region3ChangeData} region={"Region  3"} />
      </div>
      <RegionDataV2 transplantData={region4ChangeData} region={"Region  4"} />
      <RegionDataV2 transplantData={region5ChangeData} region={"Region  5"} />
      <RegionDataV2 transplantData={region6ChangeData} region={"Region  6"} />
      <RegionDataV2 transplantData={region7ChangeData} region={"Region  7"} />
      <RegionDataV2 transplantData={region8ChangeData} region={"Region  8"} />
      <div className="text-blue-600">
        <RegionDataV2 transplantData={region9ChangeData} region={"Region  9"} />
      </div>
      <div className="text-blue-600">
        <RegionDataV2
          transplantData={region10ChangeData}
          region={"Region  10"}
        />
      </div>
      <div className="text-blue-600">
        <RegionDataV2
          transplantData={region11ChangeData}
          region={"Region  11"}
        />
      </div>

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

  const todaysDate = DateTime.now()
    .setZone("America/New_York")
    .minus({ days: 1 })
    .toFormat("yyyy-MM-dd");
  // console.log("Loader Transplant Date", todaysDate);
  const region1DataToday = await getTransplantData(
    "Region  1",
    todaysDate,
    search.get("waitListType")
  );
  const region2DataToday = await getTransplantData(
    "Region  2",
    todaysDate,
    search.get("waitListType")
  );
  const region3DataToday = await getTransplantData(
    "Region  3",
    todaysDate,
    search.get("waitListType")
  );
  const region4DataToday = await getTransplantData(
    "Region  4",
    todaysDate,
    search.get("waitListType")
  );
  const region5DataToday = await getTransplantData(
    "Region  5",
    todaysDate,
    search.get("waitListType")
  );
  const region6DataToday = await getTransplantData(
    "Region  6",
    todaysDate,
    search.get("waitListType")
  );
  const region7DataToday = await getTransplantData(
    "Region  7",
    todaysDate,
    search.get("waitListType")
  );
  const region8DataToday = await getTransplantData(
    "Region  8",
    todaysDate,
    search.get("waitListType")
  );
  const region9DataToday = await getTransplantData(
    "Region  9",
    todaysDate,
    search.get("waitListType")
  );
  const region10DataToday = await getTransplantData(
    "Region  10",
    todaysDate,
    search.get("waitListType")
  );
  const region11DataToday = await getTransplantData(
    "Region  11",
    todaysDate,
    search.get("waitListType")
  );
  // console.log(regionDataToday);

  const yesterdaysDate = DateTime.now()
    .setZone("America/New_York")
    .minus({ days: 2 })
    .toFormat("yyyy-MM-dd");

  const region1DataYesterday = await getTransplantData(
    "Region  1",
    yesterdaysDate,
    search.get("waitListType")
  );
  const region2DataYesterday = await getTransplantData(
    "Region  2",
    yesterdaysDate,
    search.get("waitListType")
  );
  const region3DataYesterday = await getTransplantData(
    "Region  3",
    yesterdaysDate,
    search.get("waitListType")
  );
  const region4DataYesterday = await getTransplantData(
    "Region  4",
    yesterdaysDate,
    search.get("waitListType")
  );
  const region5DataYesterday = await getTransplantData(
    "Region  5",
    yesterdaysDate,
    search.get("waitListType")
  );
  const region6DataYesterday = await getTransplantData(
    "Region  6",
    yesterdaysDate,
    search.get("waitListType")
  );
  const region7DataYesterday = await getTransplantData(
    "Region  7",
    yesterdaysDate,
    search.get("waitListType")
  );
  const region8DataYesterday = await getTransplantData(
    "Region  8",
    yesterdaysDate,
    search.get("waitListType")
  );
  const region9DataYesterday = await getTransplantData(
    "Region  9",
    yesterdaysDate,
    search.get("waitListType")
  );
  const region10DataYesterday = await getTransplantData(
    "Region  10",
    yesterdaysDate,
    search.get("waitListType")
  );
  const region11DataYesterday = await getTransplantData(
    "Region  11",
    yesterdaysDate,
    search.get("waitListType")
  );
  // console.log(regionDataYesterday);

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

  const region1ChangeData = changeData(region1DataToday, region1DataYesterday);
  // console.log(region1ChangeData);
  const region2ChangeData = changeData(region2DataToday, region2DataYesterday);
  // console.log(region2ChangeData);
  const region3ChangeData = changeData(region3DataToday, region3DataYesterday);
  // console.log(region3ChangeData);
  const region4ChangeData = changeData(region4DataToday, region4DataYesterday);
  // console.log(region4ChangeData);
  const region5ChangeData = changeData(region5DataToday, region5DataYesterday);
  // console.log(region5ChangeData);
  const region6ChangeData = changeData(region6DataToday, region6DataYesterday);
  // console.log(region6ChangeData);
  const region7ChangeData = changeData(region7DataToday, region7DataYesterday);
  // console.log(region7ChangeData);
  const region8ChangeData = changeData(region8DataToday, region8DataYesterday);
  // console.log(region8ChangeData);
  const region9ChangeData = changeData(region9DataToday, region9DataYesterday);
  // console.log(region9ChangeData);
  const region10ChangeData = changeData(
    region10DataToday,
    region10DataYesterday
  );
  // console.log(region10ChangeData);
  const region11ChangeData = changeData(
    region11DataToday,
    region11DataYesterday
  );
  // console.log(region11ChangeData);

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
    region1ChangeData,
    region2ChangeData,
    region3ChangeData,
    region4ChangeData,
    region5ChangeData,
    region6ChangeData,
    region7ChangeData,
    region8ChangeData,
    region9ChangeData,
    region10ChangeData,
    region11ChangeData,
    todayCenterData,
    yesterdayCenterData,
    todaysCenterChange,
  };
}
