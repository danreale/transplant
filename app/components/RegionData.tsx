import { RecordArray, SelectedPick } from "@xata.io/client";
import { TransplantDataRecord } from "src/xata";

export default function RegionData({
  transplantData,
  region,
}: {
  transplantData: RecordArray<
    SelectedPick<
      TransplantDataRecord,
      ("blood_type" | "heart_status_1A" | "region" | "report_date")[]
    >
  >;
  region: string;
}) {
  return (
    <>
      <h2 className="text-2xl text-center py-2">{region}</h2>
      <div>
        <ul className="">
          {transplantData.map((record, index: number) => (
            <li key={index} className="flex justify-center space-x-2">
              <p>{record.blood_type}</p>
              <p>{record.heart_status_1A}</p>
              {record.change === 0 && (
                <p className="text-yellow-500">({record.change})</p>
              )}
              {record.change > 0 && (
                <p className="text-red-500 font-bold">(+{record.change})</p>
              )}
              {record.change < 0 && (
                <p className="text-green-500 font-bold">({record.change})</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
