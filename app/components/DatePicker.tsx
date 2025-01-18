import { useState } from "react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";

export function MyDatePicker({ startDate }: { startDate: string }) {
  let navigate = useNavigate();
  const [selected, setSelected] = useState<Date>();

  const handleSelect = (newSelected) => {
    // Update the selected dates
    setSelected(newSelected);
    const formattedDate =
      DateTime.fromJSDate(newSelected).toFormat("yyyy-MM-dd");
    navigate(`/day/${formattedDate}?waitListType=All+Types`);
  };

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      footer={
        selected
          ? `Selected: ${selected.toLocaleDateString()}`
          : "Find Past Data"
      }
      disabled={{
        before: new Date(startDate),
        after: new Date(),
      }}
    />
  );
}
