import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import { DateTime } from "luxon";
import { MyDatePicker } from "~/components/DatePicker";
import Header from "~/components/Header";
import RegionStates from "~/components/RegionStates";

import { getTransplantDates } from "~/data/db.server";
import { range } from "~/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Heart Transplant Waiting List - Home" },
    {
      name: "description",
      content: "Wait list status data for each blood type and region",
    },
  ];
};

export default function Index() {
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";
  const { dates } = useLoaderData<typeof loader>();
  return (
    <>
      <Header />
      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-400 text-3xl pb-5">
          Transplant Data Loading.....
        </div>
      )}
      <h2 className="text-center text-2xl py-2" data-testid="page-heading">
        Past Transplant Data
      </h2>
      <div
        className="text-center py-2 space-y-2"
        data-testid="data-refresh-text"
      >
        <p>
          <span className="italic">
            Data is not updated on Saturday/Sunday*
          </span>
        </p>
        <p className="italic">
          <span className="italic">
            Data is updated at 8:00 am EST Monday-Friday*
          </span>
        </p>
        <p>
          <span className="italic">
            Access up to the past 1 years worth of data*
          </span>
        </p>
      </div>
      <div className="py-5 flex justify-center">
        {/* <ul className="space-y-2">
          {dates.map((date: any, index: number) => (
            <li key={index}>
              <Link
                to={`/day/${date.report_date}?waitListType=All+Types`}
                data-testid={`report-date-${date.report_date}`}
              >
                {date.report_date} (
                {
                  DateTime.fromFormat(date.report_date, "yyyy-MM-dd")
                    .weekdayLong
                }
                )
              </Link>
            </li>
          ))}
        </ul> */}

        <MyDatePicker startDate="2024-06-20" />
      </div>

      <div className="py-5 grid justify-center text-center">
        <h2 className="py-2 font-semibold text-3xl" data-testid="region-header">
          What Region Am I In?
        </h2>
        <p data-testid="region-information">
          Aside from accrued time on the waitlist, distance is an important
          factor. It's important to know what region you are in so you can see
          how many others in your general area are waiting for the same organ.
        </p>

        {/* all regions */}
        {range(1, 12).map((num) => (
          <RegionStates region={num} />
        ))}
      </div>

      <div className="py-5 grid justify-center text-center">
        <h2
          className="py-2 font-semibold text-3xl"
          data-testid="analysis-header"
        >
          Transplant Data Analysis?
        </h2>
        <p data-testid="analysis-information">
          We make our best attempt to analyze the waiting list data to determine
          if there has been a transplant or if patients are moving around the
          waiting list to different statuses. Without the actual data, these are
          only best guesses, guesses that we can confidently say are more right
          than wrong just by looking at data patterns. In cases where we claim a
          patient receieved a transplant, there are really a few options. 1. The
          patient actually receives the transplant. 2. The patient goes home
          without needing a transplant and has made a full recovery. 3. The
          patient did not make it and is no longer on the waiting list. Since 2
          of the 3 are good outcomes, we "assume" that the patient got a
          transplant. Again, without the realtime data, we don't know for sure.
          I hope you all find this helpful as you navigate through your
          transplant journey.
        </p>
      </div>
    </>
  );
}

export async function loader({}: LoaderFunctionArgs) {
  const dates = await getTransplantDates();

  return { dates };
}
