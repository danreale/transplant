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

export default function RegionData({
  transplantData,
  regionNumber,
  timeData,
}: {
  transplantData: RecordArray<
    SelectedPick<
      TransplantDataRecord,
      (
        | "region"
        | "report_date"
        | "wait_list_type"
        | "wait_list_time"
        | "blood_type_a"
        | "blood_type_b"
        | "blood_type_o"
        | "blood_type_ab"
        | "blood_type_all"
      )[]
    >
  >;
  regionNumber: number;
  timeData: Array<TimeBreakdown>;
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
    timeData.map((d) => {
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
  return (
    <>
      <div className="flex justify-center items-center gap-x-2">
        <div className="flex justify-center text-center">
          <button
            onClick={() => handleSetRegionFavorite(`Region${regionNumber}`)}
          >
            {regionFavorite ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="font-bold" />
            )}
          </button>
        </div>
        {regionFavorite ? (
          <h2 className="text-2xl text-center text-indigo-600 font-bold italic">
            Region {regionNumber}
          </h2>
        ) : (
          <h2 className="text-2xl text-center">Region {regionNumber}</h2>
        )}
        <Popover className="relative">
          {/* may need to be bigger for a11y */}
          <PopoverButton
            className="flex items-center"
            aria-label={`Show list of states for region ${regionNumber}`}
          >
            <InformationCircle className="size-8 fill-blue-600 stroke-white" />
          </PopoverButton>
          <PopoverPanel
            anchor={{ to: "bottom start", gap: "4px" }}
            modal
            focus
            className="flex flex-col bg-white border rounded p-2"
          >
            <ul>
              {regionStates(regionNumber).map((state) => (
                <li key={state}>{state}</li>
              ))}
            </ul>
          </PopoverPanel>
        </Popover>
      </div>

      <div className="my-4">
        <ul className="">
          {transplantData.map((record, index: number) => (
            <>
              {/* <li key={index} className="flex justify-center space-x-2">
                <p className="text-center text-rose-500 font-bold">
                  {record.wait_list_type}
                </p>
              </li>
              <li key={index} className="flex justify-center space-x-2">
                <p className="text-center text-lime-600 font-bold">
                  {record.wait_list_time}
                </p>
              </li> */}

              <li
                key={`record-${index}`}
                className="flex justify-center flex-wrap gap-2"
              >
                <BloodTypeDataTile
                  label="A"
                  count={record.blood_type_a}
                  change={record.blood_type_a_change}
                  waitTimes={bloodTypeWaitTimeData("A")}
                />
                <BloodTypeDataTile
                  label="B"
                  count={record.blood_type_b}
                  change={record.blood_type_b_change}
                  waitTimes={bloodTypeWaitTimeData("B")}
                />
                <BloodTypeDataTile
                  label="AB"
                  count={record.blood_type_ab}
                  change={record.blood_type_ab_change}
                  waitTimes={bloodTypeWaitTimeData("AB")}
                />
                <BloodTypeDataTile
                  label="O"
                  count={record.blood_type_o}
                  change={record.blood_type_o_change}
                  waitTimes={bloodTypeWaitTimeData("O")}
                />
                <BloodTypeDataTile
                  label="All"
                  count={record.blood_type_all}
                  change={record.blood_type_all_change}
                  waitTimes={bloodTypeWaitTimeData("ALL")}
                />
              </li>
            </>
          ))}
        </ul>
        <div className="flex justify-center">
          <Link
            className="font-semibold my-4 text-blue-600"
            to={`/charts/${regionNumber}`}
          >
            View Trends
          </Link>
        </div>
      </div>
    </>
  );
}
