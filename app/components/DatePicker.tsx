import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";

export function DatePicker({ startDate }: { startDate: string }) {
  let navigate = useNavigate();
  const [date, setDate] = React.useState<Date>();

  const handleSelect = (newSelected) => {
    // Update the selected dates
    setDate(newSelected);
    const formattedDate =
      DateTime.fromJSDate(newSelected).toFormat("yyyy-MM-dd");
    navigate(`/day/${formattedDate}?waitListType=All+Types`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          data-testid="findPastDate"
        >
          <CalendarIcon />
          {date ? (
            format(date, "PPP")
          ) : (
            <span className="text-fuchsia-600 font-bold">Find Past Data</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          //   onSelect={setDate}
          onSelect={handleSelect}
          initialFocus
          disabled={{
            before: new Date(startDate),
            after: new Date(),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
