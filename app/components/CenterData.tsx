import { RecordArray, SelectedPick } from "@xata.io/client";
import { CenterDataRecord } from "src/xata";

export default function CenterData({
  todayCenterData,
  yesterdayCenterData,
  todaysCenterChange,
}: {
  todayCenterData: RecordArray<
    SelectedPick<CenterDataRecord, ("heart" | "report_date")[]>
  >;
  yesterdayCenterData: RecordArray<
    SelectedPick<CenterDataRecord, ("heart" | "report_date")[]>
  >;
  todaysCenterChange: number;
}) {
  return (
    <div className="py-5 text-center">
      <div className="grid justify-center text-center space-x-2">
        <label htmlFor="" className="" data-testid="todaysCenterCount">
          Today's Center Count:{" "}
          <span data-testid="todayCount">
            {todayCenterData[0]?.heart?.toString() || "NA"}
          </span>
        </label>
        <label htmlFor="" className="" data-testid="yesterdaysCenterCount">
          Yesterday's Center Count:{" "}
          <span data-testid="yesterdayCount">
            {" "}
            {yesterdayCenterData[0]?.heart?.toString() || "NA"}
          </span>
        </label>
      </div>
      <div className="flex justify-center text-center space-x-2">
        {todaysCenterChange === 0 && (
          <p
            className="text-yellow-600 font-bold"
            data-testid="todaysCenterChange"
          >
            Center Change: ({todaysCenterChange})
          </p>
        )}
        {todaysCenterChange > 0 && (
          <p
            className="text-red-500 font-bold"
            data-testid="todaysCenterChange"
          >
            Center Change: ({todaysCenterChange})
          </p>
        )}
        {todaysCenterChange < 0 && (
          <p
            className="text-green-500 font-bold"
            data-testid="todaysCenterChange"
          >
            Center Change: ({todaysCenterChange})
          </p>
        )}
      </div>
    </div>
  );
}
