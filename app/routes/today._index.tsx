import { LoaderFunctionArgs } from "@remix-run/node";
import { bloodTypeTotals, getTransplantData } from "~/data/db.server";
import { useLoaderData, useNavigation } from "@remix-run/react";
import RegionData from "~/components/RegionData";
import { DateTime } from "luxon";
import Header from "~/components/Header";

const todaysDate = DateTime.now()
  .setZone("America/New_York")
  .toFormat("MM-dd-yyyy");
export default function Appointments() {
  const {
    region1dataChange,
    region2dataChange,
    region3dataChange,
    region4dataChange,
    region5dataChange,
    region6dataChange,
    region7dataChange,
    region8dataChange,
    region9dataChange,
    region10dataChange,
    region11dataChange,
    bloodBTotal,
    bloodOTotal,
    changeB,
    changeO,
  } = useLoaderData<typeof loader>();

  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  return (
    <>
      <Header />
      <h1 className="text-center text-4xl">Today's Data</h1>
      <h2 className="text-center text-4xl text-yellow-500 italic pb-2">
        {todaysDate}
      </h2>

      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-400 text-3xl pb-5">
          Transplant Data Loading.....
        </div>
      )}
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
      <div className="text-blue-600">
        <RegionData transplantData={region1dataChange} region="Region 1" />
      </div>
      <div className="text-red-600 font-bold">
        <RegionData transplantData={region2dataChange} region="Region 2" />
      </div>

      <div className="text-blue-600">
        <RegionData transplantData={region3dataChange} region="Region 3" />
      </div>
      <RegionData transplantData={region4dataChange} region="Region 4" />
      <RegionData transplantData={region5dataChange} region="Region 5" />
      <RegionData transplantData={region6dataChange} region="Region 6" />
      <RegionData transplantData={region7dataChange} region="Region 7" />
      <RegionData transplantData={region8dataChange} region="Region 8" />
      <div className="text-blue-600">
        <RegionData transplantData={region9dataChange} region="Region 9" />
      </div>
      <div className="text-blue-600">
        <RegionData transplantData={region10dataChange} region="Region 10" />
      </div>
      <div className="text-blue-600">
        <RegionData transplantData={region11dataChange} region="Region 11" />
      </div>
      <div className="py-5 text-center">
        {changeB === 0 && (
          <div className="flex justify-center text-center space-x-2">
            <p>Blood Type B Total: {bloodBTotal.aggs.sumWaitlist}</p>
            <label htmlFor="" className="text-yellow-600 font-bold">
              ({changeB})
            </label>
          </div>
        )}
        {changeB > 0 && (
          <div className="flex justify-center text-center space-x-2">
            <p>Blood Type B Total: {bloodBTotal.aggs.sumWaitlist}</p>
            <label htmlFor="" className="text-red-500 font-bold">
              (+{changeB})
            </label>
          </div>
        )}
        {changeB < 0 && (
          <div className="flex justify-center text-center space-x-2">
            <p>Blood Type B Total: {bloodBTotal.aggs.sumWaitlist}</p>
            <label htmlFor="" className="text-green-500 font-bold">
              ({changeB})
            </label>
          </div>
        )}

        {changeO === 0 && (
          <div className="flex justify-center text-center space-x-2">
            <p>Blood Type O Total: {bloodOTotal.aggs.sumWaitlist}</p>
            <label htmlFor="" className="text-yellow-600 font-bold">
              ({changeO})
            </label>
          </div>
        )}
        {changeO > 0 && (
          <div className="flex justify-center text-center space-x-2">
            <p>Blood Type O Total: {bloodOTotal.aggs.sumWaitlist}</p>
            <label htmlFor="" className="text-red-500 font-bold">
              (+{changeO})
            </label>
          </div>
        )}
        {changeO < 0 && (
          <div className="flex justify-center text-center space-x-2">
            <p>Blood Type O Total: {bloodOTotal.aggs.sumWaitlist}</p>
            <label htmlFor="" className="text-green-500 font-bold">
              ({changeO})
            </label>
          </div>
        )}
      </div>
    </>
  );
}

export async function loader({}: LoaderFunctionArgs) {
  const todaysDate = DateTime.now()
    .setZone("America/New_York")
    .toFormat("yyyy-MM-dd");
  // console.log("Loader Transplant Date", todaysDate);
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

  const yesterdaysDate = DateTime.now()
    .setZone("America/New_York")
    .minus({ days: 1 })
    .toFormat("yyyy-MM-dd");
  const region1dataYesterday = await getTransplantData(
    "Region  1",
    yesterdaysDate
  );
  const region2dataYesterday = await getTransplantData(
    "Region  2",
    yesterdaysDate
  );
  const region3dataYesterday = await getTransplantData(
    "Region  3",
    yesterdaysDate
  );
  const region4dataYesterday = await getTransplantData(
    "Region  4",
    yesterdaysDate
  );
  const region5dataYesterday = await getTransplantData(
    "Region  5",
    yesterdaysDate
  );
  const region6dataYesterday = await getTransplantData(
    "Region  6",
    yesterdaysDate
  );
  const region7dataYesterday = await getTransplantData(
    "Region  7",
    yesterdaysDate
  );
  const region8dataYesterday = await getTransplantData(
    "Region  8",
    yesterdaysDate
  );
  const region9dataYesterday = await getTransplantData(
    "Region  9",
    yesterdaysDate
  );
  const region10dataYesterday = await getTransplantData(
    "Region  10",
    yesterdaysDate
  );
  const region11dataYesterday = await getTransplantData(
    "Region  11",
    yesterdaysDate
  );

  const bloodBTotalYesterday = await bloodTypeTotals("B", yesterdaysDate);
  const bloodOTotalYesteray = await bloodTypeTotals("O", yesterdaysDate);

  const regionDataWithChange = (regionData: any, regionDataYesterday: any) => {
    const data = regionData.map((item: any, index: number) => ({
      ...item,
      change:
        item.heart_status_1A - regionDataYesterday[index].heart_status_1A!!,
    }));
    return data;
  };

  const region1dataChange = regionDataWithChange(
    region1data,
    region1dataYesterday
  );
  const region2dataChange = regionDataWithChange(
    region2data,
    region2dataYesterday
  );
  const region3dataChange = regionDataWithChange(
    region3data,
    region3dataYesterday
  );
  const region4dataChange = regionDataWithChange(
    region4data,
    region4dataYesterday
  );
  const region5dataChange = regionDataWithChange(
    region5data,
    region5dataYesterday
  );
  const region6dataChange = regionDataWithChange(
    region6data,
    region6dataYesterday
  );
  const region7dataChange = regionDataWithChange(
    region7data,
    region7dataYesterday
  );
  const region8dataChange = regionDataWithChange(
    region8data,
    region8dataYesterday
  );
  const region9dataChange = regionDataWithChange(
    region9data,
    region9dataYesterday
  );
  const region10dataChange = regionDataWithChange(
    region10data,
    region10dataYesterday
  );
  const region11dataChange = regionDataWithChange(
    region11data,
    region11dataYesterday
  );

  const changeB =
    bloodBTotal.aggs.sumWaitlist!! - bloodBTotalYesterday.aggs.sumWaitlist!!;
  const changeO =
    bloodOTotal.aggs.sumWaitlist!! - bloodOTotalYesteray.aggs.sumWaitlist!!;

  return {
    region1dataChange,
    region2dataChange,
    region3dataChange,
    region4dataChange,
    region5dataChange,
    region6dataChange,
    region7dataChange,
    region8dataChange,
    region9dataChange,
    region10dataChange,
    region11dataChange,
    bloodBTotal,
    bloodOTotal,
    changeB,
    changeO,
  };
}
