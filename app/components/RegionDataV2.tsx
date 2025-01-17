import { RecordArray, SelectedPick } from "@xata.io/client";
import { TransplantDataRecord } from "src/xata";
import { regionStates } from "~/data/states";
import BloodTypeDataTile from "./BloodTypeDataTile";
import { Link } from "@remix-run/react";
import InformationCircle from "~/icons/information-circle";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useLayoutEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { TimeBreakdown } from "~/utils";
import { REGION_CHANGE_OBJ } from "~/data/change-data-smart.server";

export default function RegionData({
  regionNumber,
  timeData,
  transplantData,
  waitListType,
}: {
  regionNumber: number;
  timeData: Array<TimeBreakdown>;
  transplantData: REGION_CHANGE_OBJ;
  waitListType: string;
}) {
  const [regionFavorite, setRegionFavorite] = useState(false);

  function handleSetRegionFavorite(region: string) {
    if (regionFavorite) {
      localStorage.setItem(region, "false");
      localStorage.removeItem(region);
      setRegionFavorite(false);
    } else {
      localStorage.setItem(region, "true");
      setRegionFavorite(true);
    }
  }
  useLayoutEffect(() => {
    const isFave = window.localStorage.getItem(`Region${regionNumber}`);
    if (isFave) {
      localStorage.setItem(`Region${regionNumber}`, "true");
      setRegionFavorite(true);
    }
  }, []);

  // Get wait list times for each blood type
  const bloodTypeWaitTimeData = (bloodType: string) =>
    timeData
      .filter((t) => t.wait_list_type === waitListType)
      .map((d) => {
        if (bloodType === "A") {
          return {
            wait_list_time: d.wait_list_time,
            count: d.blood_type_a,
          };
        }
        if (bloodType === "B") {
          return {
            wait_list_time: d.wait_list_time,
            count: d.blood_type_b,
          };
        }
        if (bloodType === "AB") {
          return {
            wait_list_time: d.wait_list_time,
            count: d.blood_type_ab,
          };
        }
        if (bloodType === "O") {
          return {
            wait_list_time: d.wait_list_time,
            count: d.blood_type_o,
          };
        }
        if (bloodType === "ALL") {
          return {
            wait_list_time: d.wait_list_time,
            count: d.blood_type_all,
          };
        }
      });

  const regionWaitListBloodTypeData = transplantData.wait_list_types.filter(
    (w) => w.type === waitListType
  )[0];

  return (
    <>
      <div className="flex justify-center items-center gap-x-2">
        <div className="flex justify-center text-center">
          <button
            onClick={() => handleSetRegionFavorite(`Region${regionNumber}`)}
            data-testid={`favorite-region-${regionNumber}`}
          >
            {regionFavorite ? (
              <FaStar
                className="text-yellow-400"
                data-testid={`region${regionNumber}Star`}
              />
            ) : (
              <FaRegStar
                className="font-bold"
                data-testid={`region${regionNumber}NoStar`}
              />
            )}
          </button>
        </div>
        {regionFavorite ? (
          <h2
            className="text-2xl text-center text-indigo-600 font-bold italic"
            data-testid={`region${regionNumber}Favorited`}
          >
            Region {regionNumber}
          </h2>
        ) : (
          <h2
            className="text-2xl text-center"
            data-testid={`region${regionNumber}NotFavorited`}
          >
            Region {regionNumber}
          </h2>
        )}
        <Popover className="relative">
          {/* may need to be bigger for a11y */}
          <PopoverButton
            className="flex items-center"
            aria-label={`Show list of states for region ${regionNumber}`}
            data-testid={`region-${regionNumber}-info`}
          >
            <InformationCircle className="size-8 fill-blue-600 stroke-white" />
          </PopoverButton>
          <PopoverPanel
            anchor={{ to: "bottom start", gap: "4px" }}
            modal
            focus
            className="flex flex-col bg-white border rounded p-2"
            data-testid={`region-${regionNumber}-popover`}
          >
            <ul>
              {regionStates(regionNumber).map((state) => (
                <li key={state} data-testid={state}>
                  {state}
                </li>
              ))}
            </ul>
          </PopoverPanel>
        </Popover>
      </div>

      <div className="my-4" data-testid={`region-${regionNumber}-section`}>
        <ul className="">
          <li key={`bloodtype`} className="flex justify-center flex-wrap gap-2">
            <BloodTypeDataTile
              label="A"
              count={
                regionWaitListBloodTypeData.blood_types.filter(
                  (bt) => bt.blood_type === "a"
                )[0].today
              }
              change={
                regionWaitListBloodTypeData.blood_types.filter(
                  (bt) => bt.blood_type === "a"
                )[0].change
              }
              waitTimes={bloodTypeWaitTimeData("A")}
            />
            <BloodTypeDataTile
              label="B"
              count={
                regionWaitListBloodTypeData.blood_types.filter(
                  (bt) => bt.blood_type === "b"
                )[0].today
              }
              change={
                regionWaitListBloodTypeData.blood_types.filter(
                  (bt) => bt.blood_type === "b"
                )[0].change
              }
              waitTimes={bloodTypeWaitTimeData("B")}
            />
            <BloodTypeDataTile
              label="AB"
              count={
                regionWaitListBloodTypeData.blood_types.filter(
                  (bt) => bt.blood_type === "ab"
                )[0].today
              }
              change={
                regionWaitListBloodTypeData.blood_types.filter(
                  (bt) => bt.blood_type === "ab"
                )[0].change
              }
              waitTimes={bloodTypeWaitTimeData("AB")}
            />
            <BloodTypeDataTile
              label="O"
              count={
                regionWaitListBloodTypeData.blood_types.filter(
                  (bt) => bt.blood_type === "o"
                )[0].today
              }
              change={
                regionWaitListBloodTypeData.blood_types.filter(
                  (bt) => bt.blood_type === "o"
                )[0].change
              }
              waitTimes={bloodTypeWaitTimeData("O")}
            />
            <BloodTypeDataTile
              label="All"
              count={
                regionWaitListBloodTypeData.blood_types.filter(
                  (bt) => bt.blood_type === "all"
                )[0].today
              }
              change={
                regionWaitListBloodTypeData.blood_types.filter(
                  (bt) => bt.blood_type === "all"
                )[0].change
              }
              waitTimes={bloodTypeWaitTimeData("ALL")}
            />
          </li>
        </ul>

        <div className="flex justify-center py-2">
          <ul>
            {transplantData.messages.map((record, index: number) => (
              <li>
                {record === "Patient Received Transplant" ? (
                  <p
                    data-testid={`region${regionNumber}_daily_smart_messages-${index}`}
                    key={index}
                    className="text-green-600 font-bold text-center"
                  >
                    🎉 {record} 🎉
                  </p>
                ) : record === "Patient Added To Waiting List" ? (
                  <p
                    data-testid={`region${regionNumber}_daily_smart_messages-${index}`}
                    key={index}
                    className="text-red-600 font-bold text-center"
                  >
                    💔 {record} 💔
                  </p>
                ) : (
                  <p
                    data-testid={`region${regionNumber}_daily_smart_messages-${index}`}
                    key={index}
                    className="text-slate-800 text-center"
                  >
                    {record}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center">
          <Link
            className="font-semibold my-4 text-blue-600"
            to={`/charts/${regionNumber}`}
            data-testid={`view-trends-region${regionNumber}`}
          >
            View Trends
          </Link>
        </div>
      </div>
    </>
  );
}
