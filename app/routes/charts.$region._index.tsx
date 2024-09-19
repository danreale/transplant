import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigation, useParams } from "@remix-run/react";
import CenterDataChart from "~/components/CenterDataChart";
import DonorDataChart from "~/components/DonorChart";
import Header from "~/components/Header";
import RegionChartV2 from "~/components/RegionChartV2";
import RegionChart from "~/components/RegionChartV2";
import RegionChartV3 from "~/components/RegionChartV3";
import RegionStates from "~/components/RegionStates";
import TransplantChart from "~/components/TransplantChart";
import {
  bloodTypeTotalsChart,
  centerDataTotalsChart,
  getDonorCountDatesB,
  getTransplantDates,
  getTransplantStatusCountDatesForRegion,
} from "~/data/db.server";
import { regionStates } from "~/data/states";

export const meta: MetaFunction = () => {
  return [
    { title: "Heart Transplant Waiting List" },
    { name: "description", content: "Status 1A Blood Type B and O" },
  ];
};

export default function Index() {
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const { bloodTypeTotals, centerData, donorData, statusData } =
    useLoaderData<typeof loader>();
  const params = useParams();
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
        <RegionChartV3 data={statusData} />

        {params.region === "2" && (
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

export async function loader({ params }: LoaderFunctionArgs) {
  const region = params.region;
  const dates = await getTransplantDates();

  const bloodTypeTotals = await bloodTypeTotalsChart(`Region  ${region}`);
  // console.log(bloodTypeTotals);

  const centerData = await centerDataTotalsChart();

  const donorData = await getDonorCountDatesB();

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

  return {
    dates,
    bloodTypeTotals,
    centerData,
    donorData,
    statusData,
  };
}
