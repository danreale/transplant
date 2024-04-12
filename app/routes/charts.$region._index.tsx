import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigation, useParams } from "@remix-run/react";
import CenterDataChart from "~/components/CenterDataChart";
import Header from "~/components/Header";
import TransplantChart from "~/components/TransplantChart";
import {
  bloodTypeTotalsChart,
  centerDataTotalsChart,
  getCenterData,
  getTransplantDates,
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
  const { bloodBRegion2TotalB, bloodBRegion2TotalO, centerData } =
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
        <h2 className="text-2xl text-center py-5">Region {params.region}</h2>
        <p className="pb-5">
          ({regionStates(parseInt(params.region!!)).join(", ")})
        </p>
        <h3 className="text-2xl text-center">B</h3>
        <TransplantChart data={bloodBRegion2TotalB} />
        <h3 className="text-2xl text-center py-2">O</h3>
        <TransplantChart data={bloodBRegion2TotalO} />

        {params.region === "2" && (
          <>
            <h3 className="text-2xl text-center py-2">CHOP</h3>
            <CenterDataChart data={centerData} />
          </>
        )}
      </div>
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const region = params.region;
  const dates = await getTransplantDates();

  const bloodBRegion2TotalB = await bloodTypeTotalsChart(
    `Region  ${region}`,
    "B"
  );

  const bloodBRegion2TotalO = await bloodTypeTotalsChart(
    `Region  ${region}`,
    "O"
  );

  const centerData = await centerDataTotalsChart();

  return { dates, bloodBRegion2TotalB, bloodBRegion2TotalO, centerData };
}
