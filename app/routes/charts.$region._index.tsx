import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import CenterDataChart from "~/components/CenterDataChart";
import Header from "~/components/Header";
import RegionChartV2 from "~/components/RegionChartV2";
import RegionChartV3 from "~/components/RegionChartV3";
import RegionStates from "~/components/RegionStates";
import {
  bloodTypeTotalsChart,
  bloodTypeTotalsChartAdult,
  centerDataTotalsChart,
  getDonorCountDatesB,
  getTransplantDates,
  getTransplantStatusCountDatesForRegion,
  getTransplantStatusCountDatesForRegionAdult,
} from "~/data/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Heart Transplant Waiting List - Region Charts" },
    { name: "description", content: "Region Charts" },
  ];
};

export default function Index() {
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const { bloodTypeTotals, centerData, donorData, statusData } =
    useLoaderData<typeof loader>();
  const params = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const age = (searchParams.get("ageGroupType") as string) || "Pediatric";
  return (
    <>
      <Header />
      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-400 text-3xl pb-5">
          Transplant Data Loading.....
        </div>
      )}

      <div className="grid justify-center text-center pb-5">
        <h2 className="text-2xl text-center">Region {params.region}</h2>
        {/* <p className="pb-5">
          ({regionStates(parseInt(params.region!!)).join(", ")})
        </p> */}
        <div className="pb-5">
          <RegionStates region={parseInt(params.region!!)} title={false} />
        </div>

        <h3 className="text-2xl text-center">Blood Types</h3>
        <RegionChartV2 data={bloodTypeTotals} />

        <h3 className="text-2xl text-center py-2">Wait List Type Type</h3>
        <RegionChartV3 data={statusData} age={age} />

        {params.region === "2" && age === "Pediatric" && (
          <>
            <h3 className="text-2xl text-center py-2">CHOP</h3>
            <CenterDataChart data={centerData} />

            {/* <h3 className="text-2xl text-center py-2">Donors</h3>
            <DonorDataChart data={donorData} /> */}
          </>
        )}
      </div>
    </>
  );
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const age = (search.get("ageGroupType") as string) || "Pediatric";
  const region = params.region;
  const dates = await getTransplantDates();

  const bloodTotals = async () => {
    if (age === "Pediatric") {
      return await bloodTypeTotalsChart(`Region  ${region}`);
    } else {
      return await bloodTypeTotalsChartAdult(`Region  ${region}`);
    }
  };

  const bloodTypeTotals = await bloodTotals();

  // console.log(bloodTypeTotals);

  const centerData = await centerDataTotalsChart();

  const donorData = await getDonorCountDatesB();

  const getStatusData = async () => {
    if (age === "Pediatric") {
      const heartStatus1A = await getTransplantStatusCountDatesForRegion(
        "Heart Status 1A",
        region!!
      );
      const heartStatus1B = await getTransplantStatusCountDatesForRegion(
        "Heart Status 1B",
        region!!
      );
      const heartStatus2 = await getTransplantStatusCountDatesForRegion(
        "Heart Status 2",
        region!!
      );
      const heartStatus7 = await getTransplantStatusCountDatesForRegion(
        "Heart Status 7 (Inactive)",
        region!!
      );
      const statusData = [];

      for (let index = 0; index < heartStatus1A.length; index++) {
        const element1 = heartStatus1A[index];
        const element2 = heartStatus1B[index];
        const element3 = heartStatus2[index];
        const element4 = heartStatus7[index];

        const obj = {
          report_date: element1.report_date,
          heart_status_1a: element1.wlt,
          heart_status_1b: element2.wlt,
          heart_status_2: element3.wlt,
          heart_status_7: element4.wlt,
        };
        statusData.push(obj);
      }
      return statusData;
    } else {
      const adultStatus1 = await getTransplantStatusCountDatesForRegionAdult(
        "Adult Status 1",
        region!!
      );
      const adultStatus2 = await getTransplantStatusCountDatesForRegionAdult(
        "Adult Status 2",
        region!!
      );
      const adultStatus3 = await getTransplantStatusCountDatesForRegionAdult(
        "Adult Status 3",
        region!!
      );
      const adultStatus4 = await getTransplantStatusCountDatesForRegionAdult(
        "Adult Status 4",
        region!!
      );
      const adultStatus5 = await getTransplantStatusCountDatesForRegionAdult(
        "Adult Status 5",
        region!!
      );
      const adultStatus6 = await getTransplantStatusCountDatesForRegionAdult(
        "Adult Status 6",
        region!!
      );
      const statusData = [];

      for (let index = 0; index < adultStatus1.length; index++) {
        const element1 = adultStatus1[index];
        const element2 = adultStatus2[index];
        const element3 = adultStatus3[index];
        const element4 = adultStatus4[index];
        const element5 = adultStatus5[index];
        const element6 = adultStatus6[index];

        const obj = {
          report_date: element1.report_date,
          adult_status_1: element1.wlt,
          adult_status_2: element2.wlt,
          adult_status_3: element3.wlt,
          adult_status_4: element4.wlt,
          adult_status_5: element5.wlt,
          adult_status_6: element6.wlt,
        };
        statusData.push(obj);
      }
      return statusData;
    }
  };

  const statusData = await getStatusData();

  return {
    dates,
    bloodTypeTotals,
    centerData,
    donorData,
    statusData,
  };
}
