import clsx from "clsx";

import DataChange from "./DataChange";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { regionStates } from "~/data/states";
import InformationCircle from "~/icons/information-circle";
import { TimeBreakdown } from "~/utils";

type Props = {
  label: string;
  count: number;
  change: number;
  waitTimes: Array<{ wait_list_time: string; count: number }>;
};

export default function BloodTypeDataTile({
  label,
  count,
  change,
  waitTimes,
}: Props) {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="font-semibold">{label}</span>
      {/* Tile */}
      <Popover className="relative">
        <PopoverButton
          className="flex items-center"
          aria-label={`Show waiting time breakdown`}
        >
          <div
            className={clsx(
              change > 0 && "border-red-500 bg-red-50",
              change < 0 && "border-green-500 bg-green-50",
              "flex flex-col justify-center items-center border rounded w-16 h-16 shadow-sm relative"
            )}
          >
            <label htmlFor="">{count}</label>
            <div className="absolute bottom-1">
              <DataChange count={change} />
            </div>
          </div>
        </PopoverButton>
        <PopoverPanel
          anchor={{ to: "bottom start", gap: "4px" }}
          modal
          focus
          className="flex flex-col bg-white border rounded p-2"
        >
          <ul className="text-center">
            {waitTimes.map((d, index) => (
              <li
                key={index}
                className="grid text-center justify-center border-2 bg-amber-50 px-1"
              >
                <span className="italic">{d.wait_list_time}</span>
                <span className="font-bold pb-0">{d.count}</span>
              </li>
            ))}
          </ul>
        </PopoverPanel>
      </Popover>
    </div>
  );
}
