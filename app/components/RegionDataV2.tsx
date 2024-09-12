import { RecordArray, SelectedPick } from "@xata.io/client";
import { TransplantDataRecord } from "src/xata";
import { regionStates } from "~/data/states";
import BloodTypeDataTile from "./BloodTypeDataTile";
import { Link } from "@remix-run/react";
import InformationCircle from "~/icons/information-circle";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

export default function RegionData({
  transplantData,
  regionNumber,
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
}) {
  return (
    <>
      <div className="flex justify-center items-center gap-x-2">
        <h2 className="text-2xl text-center">Region {regionNumber}</h2>
        <Popover className="relative">
          {/* may need to be bigger for a11y */}
          <PopoverButton className="flex items-center" aria-label={`Show list of states for region ${regionNumber}`}>
            <InformationCircle className="size-8 fill-blue-600 stroke-white" />
          </PopoverButton>
          <PopoverPanel anchor={{ to: 'bottom start', gap: '4px' }} modal focus className="flex flex-col bg-white border rounded p-2">
            <ul>
              {regionStates(regionNumber).map(state => <li key={state}>{state}</li>)}
            </ul>
          </PopoverPanel>
        </Popover>
      </div>

      <div className="py-2">
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

              <li key={`record-${index}`} className="flex justify-center flex-wrap gap-2">
                <BloodTypeDataTile label="A" count={record.blood_type_a} change={record.blood_type_a_change} />
                <BloodTypeDataTile label="B" count={record.blood_type_b} change={record.blood_type_b_change} />
                <BloodTypeDataTile label="AB" count={record.blood_type_ab} change={record.blood_type_ab_change} />
                <BloodTypeDataTile label="O" count={record.blood_type_o} change={record.blood_type_o_change} />
                <BloodTypeDataTile label="All" count={record.blood_type_all} change={record.blood_type_all_change} />
              </li>
            </>
          ))}
        </ul>
        <Link className="text-center font-semibold block my-4 text-blue-600" to={`/charts/${regionNumber}`}>View Trends</Link>
      </div>
    </>
  );
}
