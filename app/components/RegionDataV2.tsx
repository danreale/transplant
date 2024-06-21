import { RecordArray, SelectedPick } from "@xata.io/client";
import { TransplantDataRecord } from "src/xata";
import { regionStates } from "~/data/states";
import DataChange from "./DataChange";

export default function RegionData({
  transplantData,
  region,
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
  region: string;
}) {
  return (
    <>
      <h2 className="text-2xl text-center">{region}</h2>
      <p className="text-center">
        ({regionStates(parseInt(region.split("Region ")[1])).join(", ")})
      </p>
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

              <li key={index} className="flex justify-center space-x-2">
                <p className="flex justify-center text-center font-semibold space-x-1">
                  <label htmlFor=""> A: {record.blood_type_a}</label>
                  <DataChange bloodType={record.blood_type_a_change} />
                </p>
                <p className="flex justify-center text-center font-semibold space-x-1">
                  <label htmlFor=""> B: {record.blood_type_b}</label>
                  <DataChange bloodType={record.blood_type_b_change} />
                </p>
                <p className="flex justify-center text-center font-semibold space-x-1">
                  <label htmlFor=""> AB: {record.blood_type_ab}</label>
                  <DataChange bloodType={record.blood_type_ab_change} />
                </p>
                <p className="flex justify-center text-center font-semibold space-x-1">
                  <label htmlFor=""> O: {record.blood_type_o}</label>
                  <DataChange bloodType={record.blood_type_o_change} />
                </p>
                <p className="flex justify-center text-center font-semibold space-x-1">
                  <label htmlFor=""> All: {record.blood_type_all}</label>
                  <DataChange bloodType={record.blood_type_all_change} />
                </p>
              </li>
            </>
          ))}
        </ul>
      </div>
    </>
  );
}
