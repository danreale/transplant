import { LoaderFunctionArgs } from "@remix-run/node";
import {
  bloodTypeTotals,
  getCenterData,
  getDonorData,
  getTransplantData,
} from "~/data/db.server";
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

const todaysDate = DateTime.now()
  .setZone("America/New_York")
  .toFormat("MM-dd-yyyy");
export default function Appointments() {
  const { regionChangeData } = useLoaderData<typeof loader>();

  const params = useParams();
  const [parms] = useSearchParams();

  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  return (
    <>
      <Header />
      <h1 className="text-center text-4xl">Transplant Data</h1>
      <h2 className="text-center text-4xl text-yellow-500 italic pb-2">
        {params.day}
      </h2>

      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-400 text-3xl pb-5">
          Transplant Data Loading.....
        </div>
      )}

      <div className="grid justify-center text-center py-5">
        <Form>
          <div className="grid justify-center text-center py-5">
            <div className="grid justify-center text-center py-2">
              <label htmlFor="">Choose Region</label>
              <select
                name="region"
                id="region"
                className="text-center"
                defaultValue={parms.get("region") || "Region  2"}
              >
                <option value="All Regions">All Regions</option>
                <option value="Region  1">Region 1</option>
                <option value="Region  2">Region 2</option>
                <option value="Region  3">Region 3</option>
                <option value="Region  4">Region 4</option>
                <option value="Region  5">Region 5</option>
                <option value="Region  6">Region 6</option>
                <option value="Region  7">Region 7</option>
                <option value="Region  8">Region 8</option>
                <option value="Region  9">Region 9</option>
                <option value="Region  10">Region 10</option>
                <option value="Region  11">Region 11</option>
              </select>
            </div>

            <div className="grid justify-center text-center py-2">
              <label htmlFor="">Choose Wait List Type</label>
              <select
                name="waitListType"
                id="waitListType"
                className="text-center"
                defaultValue={parms.get("waitListType") || "Heart Status 1A"}
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

            <div className="grid justify-center text-center py-2">
              <label htmlFor="">Choose Wait List Time</label>
              <select
                name="waitListTime"
                id="waitListTime"
                className="text-center"
                defaultValue={
                  parms.get("waitListTime") || "90 Days to < 6 Months"
                }
              >
                <option value="All Time">All Time</option>
                <option value="< 30 Days">Less 30 Days</option>
                <option value="30 to < 90 Days">30 to 90 Days</option>
                <option value="90 Days to < 6 Months">
                  90 Days to 6 Months
                </option>
                <option value="6 Months to < 1 Year">6 Months to 1 Year</option>
                <option value="1 Year to < 2 Years">1 Year to 2 Years</option>
                <option value="2 Year to < 3 Years">2 Years to 3 Years</option>
                <option value="3 Year to < 5 Years">3 Years to 5 Years</option>
                <option value="5 or More Years">5 or More Years</option>
              </select>
            </div>

            {/* <div className="grid justify-center text-center py-2">
              <input
                type="date"
                id="reportDate"
                name="reportDate"
                defaultValue={params.get("reportDate") || todaysDate}
              />
            </div> */}

            <button type="submit" className="text-blue-500 font-bold">
              Filter
            </button>
          </div>
        </Form>
      </div>

      <div className="text-blue-600">
        <RegionDataV2
          transplantData={regionChangeData}
          region={parms.get("region") || "Region  2"}
        />
      </div>
    </>
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);

  const todaysDate = params.day!!;

  const yesterdaysDate = DateTime.fromFormat(todaysDate, "yyyy-MM-dd")
    // .setZone("America/New_York")
    .minus({ days: 1 })
    .toFormat("yyyy-MM-dd");

  // console.log("Loader Transplant Date", todaysDate);
  const regionDataToday = await getTransplantData(
    search.get("region") || "Region  2",
    todaysDate,
    search.get("waitListType") || "Heart Status 1A",
    search.get("waitListTime") || "90 Days to < 6 Months"
  );
  // console.log(regionDataToday);

  const regionDataYesterday = await getTransplantData(
    search.get("region") || "Region  2",
    yesterdaysDate,
    search.get("waitListType") || "Heart Status 1A",
    search.get("waitListTime") || "90 Days to < 6 Months"
  );
  // console.log(regionDataYesterday);

  const changeData = (regionDataToday: any, regionDataYesterday: any) => {
    return [
      {
        ...regionDataToday[0],
        blood_type_a_change:
          regionDataToday[0].blood_type_a - regionDataYesterday[0].blood_type_a,
        blood_type_b_change:
          regionDataToday[0].blood_type_b - regionDataYesterday[0].blood_type_b,
        blood_type_o_change:
          regionDataToday[0].blood_type_o - regionDataYesterday[0].blood_type_o,
        blood_type_ab_change:
          regionDataToday[0].blood_type_ab -
          regionDataYesterday[0].blood_type_ab,
        blood_type_all_change:
          regionDataToday[0].blood_type_all -
          regionDataYesterday[0].blood_type_all,
      },
    ];
  };

  const regionChangeData = changeData(regionDataToday, regionDataYesterday);
  console.log(regionChangeData);

  return {
    regionChangeData,
  };
}
