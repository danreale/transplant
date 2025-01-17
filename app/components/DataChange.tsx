import ArrowTrendingDown from "~/icons/arrow-trending-down";
import { ArrowTrendingUp } from "~/icons/arrow-trending-up";

export default function DataChange({ count }: { count: number }) {
  // if no change, omit number and trend icon
  if (count === 0) return;
  return (
    <div className="flex gap-1" data-testid="data-change">
      {count > 0 && <ArrowTrendingUp className="text-red-600 size-4" />}
      {count < 0 && <ArrowTrendingDown className="text-green-600 size-4" />}
      <p className="font-bold text-xs" data-testid="data-change-count">
        {count}
      </p>
    </div>
  );
}
