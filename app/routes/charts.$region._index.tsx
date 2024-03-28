import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigation, useParams } from "@remix-run/react";
import Header from "~/components/Header";
import TransplantChart from "~/components/TransplantChart";
import { bloodTypeTotalsChart, getTransplantDates } from "~/data/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Heart Transplant Waiting List" },
    { name: "description", content: "Status 1A Blood Type B and O" },
  ];
};

export default function Index() {
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const { bloodBRegion2TotalB, bloodBRegion2TotalO } =
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
        <h3 className="text-2xl text-center">B</h3>
        <TransplantChart data={bloodBRegion2TotalB} />
        <h3 className="text-2xl text-center py-2">O</h3>
        <TransplantChart data={bloodBRegion2TotalO} />
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

  return { dates, bloodBRegion2TotalB, bloodBRegion2TotalO };
}
