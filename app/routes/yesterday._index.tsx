import { LoaderFunctionArgs } from "@remix-run/node";
import { bloodTypeTotals, getTransplantData } from "~/data/db.server";
import { useLoaderData } from "@remix-run/react";
import RegionData from "~/components/RegionData";
import { DateTime } from "luxon";
import Header from "~/components/Header";

const todaysDate = DateTime.now()
  .setZone("America/New_York")
  .minus({ days: 1 })
  .toFormat("MM-dd-yyyy");
export default function Appointments() {
  const {
    region1data,
    region2data,
    region3data,
    region4data,
    region5data,
    region6data,
    region7data,
    region8data,
    region9data,
    region10data,
    region11data,
    bloodBTotal,
    bloodOTotal,
  } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      <h1 className="text-center text-4xl">Yesterday's Data</h1>
      <h2 className="text-center text-4xl text-blue-500 italic pb-2">
        {todaysDate}
      </h2>

      {/* <h2 className="text-2xl text-center py-2">Region 2</h2>
      <div>
        <ul className="">
          {transplantData.map((record: any, index: number) => (
            <li key={index} className="flex justify-center space-x-2">
              <p>{record.blood_type}</p>
              <p>{record.heart_status_1A}</p>
            </li>
          ))}
        </ul>
      </div> */}
      <RegionData transplantData={region1data} region="Region 1" />
      <div className="text-red-600 font-bold">
        <RegionData transplantData={region2data} region="Region 2" />
      </div>
      <RegionData transplantData={region3data} region="Region 3" />
      <RegionData transplantData={region4data} region="Region 4" />
      <RegionData transplantData={region5data} region="Region 5" />
      <RegionData transplantData={region6data} region="Region 6" />
      <RegionData transplantData={region7data} region="Region 7" />
      <RegionData transplantData={region8data} region="Region 8" />
      <RegionData transplantData={region9data} region="Region 9" />
      <RegionData transplantData={region10data} region="Region 10" />
      <RegionData transplantData={region11data} region="Region 11" />
      <div className="py-5 text-center">
        <p>Blood Type B Total: {bloodBTotal.aggs.sumWaitlist}</p>
        <p>Blood Type O Total: {bloodOTotal.aggs.sumWaitlist}</p>
      </div>
    </>
  );
}

export async function loader({}: LoaderFunctionArgs) {
  const todaysDate = DateTime.now()
    .setZone("America/New_York")
    .minus({ days: 1 })
    .toFormat("yyyy-MM-dd");
  //   console.log("Loader Transplant Date", todaysDate);
  const region1data = await getTransplantData("Region  1", todaysDate);
  const region2data = await getTransplantData("Region  2", todaysDate);
  const region3data = await getTransplantData("Region  3", todaysDate);
  const region4data = await getTransplantData("Region  4", todaysDate);
  const region5data = await getTransplantData("Region  5", todaysDate);
  const region6data = await getTransplantData("Region  6", todaysDate);
  const region7data = await getTransplantData("Region  7", todaysDate);
  const region8data = await getTransplantData("Region  8", todaysDate);
  const region9data = await getTransplantData("Region  9", todaysDate);
  const region10data = await getTransplantData("Region  10", todaysDate);
  const region11data = await getTransplantData("Region  11", todaysDate);
  const bloodBTotal = await bloodTypeTotals("B", todaysDate);
  const bloodOTotal = await bloodTypeTotals("O", todaysDate);

  return {
    region1data,
    region2data,
    region3data,
    region4data,
    region5data,
    region6data,
    region7data,
    region8data,
    region9data,
    region10data,
    region11data,
    bloodBTotal,
    bloodOTotal,
  };
}
