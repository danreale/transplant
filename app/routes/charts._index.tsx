import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import DonorDataChart from "~/components/DonorChart";

import Header from "~/components/Header";
import RegionChartV2 from "~/components/RegionChartV2";
import RegionChartV3 from "~/components/RegionChartV3";
import {
  getDonorCountDatesB,
  getTransplantCountDates,
  getTransplantStatusCountDates,
} from "~/data/db.server";
import { regionStates } from "~/data/states";

export default function Index() {
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const { bloodTypeTotals, donorData, statusData } =
    useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-400 text-3xl pb-5">
          Transplant Data Loading.....
        </div>
      )}
      <h2 className="text-center text-2xl py-2">Region Charts</h2>

      <div className="grid justify-center text-center pb-5">
        <h2 className="text-2xl text-center py-5">
          Wait List Chart Totals (USA)
        </h2>
        <h3 className="text-2xl text-center py-2">Blood Type</h3>
        <RegionChartV2 data={bloodTypeTotals} />
        <h3 className="text-2xl text-center py-2">Wait List Type Type</h3>
        <RegionChartV3 data={statusData} />
        {/* <h3 className="text-2xl text-center py-2">Donors</h3>
        <DonorDataChart data={donorData} /> */}
      </div>
    </>
  );
}

export async function loader({}: LoaderFunctionArgs) {
  const bloodTypeTotals = await getTransplantCountDates();
  // console.log(bloodTypeTotals);
  const donorData = await getDonorCountDatesB();
  const heartStatus1A = await getTransplantStatusCountDates("Heart Status 1A");
  const heartStatus1B = await getTransplantStatusCountDates("Heart Status 1B");
  const heartStatus2 = await getTransplantStatusCountDates("Heart Status 2");
  const heartStatus7 = await getTransplantStatusCountDates(
    "Heart Status 7 (Inactive)"
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

  // console.log(statusData);

  return { bloodTypeTotals, donorData, statusData };
}
