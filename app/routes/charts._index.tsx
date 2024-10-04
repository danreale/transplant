import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";

import Header from "~/components/Header";
import RegionChartV2 from "~/components/RegionChartV2";
import RegionChartV3 from "~/components/RegionChartV3";
import {
  getDonorCountDatesB,
  getTransplantCountDates,
  getTransplantCountDatesAdult,
  getTransplantStatusCountDates,
  getTransplantStatusCountDatesAdult,
} from "~/data/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Heart Transplant Waiting List - USA Charts" },
    { name: "description", content: "USA Charts" },
  ];
};

export default function Index() {
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const { bloodTypeTotals, statusData } = useLoaderData<typeof loader>();

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
      <h2 className="text-center text-2xl py-2">Region Charts</h2>

      <div className="grid justify-center text-center pb-5">
        <h2 className="text-2xl text-center py-5">
          Wait List Chart Totals (USA)
        </h2>
        <h3 className="text-2xl text-center py-2">Blood Type</h3>
        <RegionChartV2 data={bloodTypeTotals} />
        <h3 className="text-2xl text-center py-2">Wait List Type Type</h3>
        <RegionChartV3 data={statusData} age={age} />
        {/* <h3 className="text-2xl text-center py-2">Donors</h3>
        <DonorDataChart data={donorData} /> */}
      </div>
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const age = (search.get("ageGroupType") as string) || "Pediatric";

  const bloodTotals = async () => {
    if (age === "Pediatric") {
      return await getTransplantCountDates();
    } else {
      return await getTransplantCountDatesAdult();
    }
  };

  const bloodTypeTotals = await bloodTotals();

  const getStatusData = async () => {
    if (age === "Pediatric") {
      const heartStatus1A = await getTransplantStatusCountDates(
        "Heart Status 1A"
      );
      const heartStatus1B = await getTransplantStatusCountDates(
        "Heart Status 1B"
      );
      const heartStatus2 = await getTransplantStatusCountDates(
        "Heart Status 2"
      );
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
      return statusData;
    } else {
      const adultStatus1 = await getTransplantStatusCountDatesAdult(
        "Adult Status 1"
      );
      const adultStatus2 = await getTransplantStatusCountDatesAdult(
        "Adult Status 2"
      );
      const adultStatus3 = await getTransplantStatusCountDatesAdult(
        "Adult Status 3"
      );
      const adultStatus4 = await getTransplantStatusCountDatesAdult(
        "Adult Status 4"
      );
      const adultStatus5 = await getTransplantStatusCountDatesAdult(
        "Adult Status 5"
      );
      const adultStatus6 = await getTransplantStatusCountDatesAdult(
        "Adult Status 6"
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

  return { bloodTypeTotals, statusData };
}
