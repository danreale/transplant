import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import { DateTime } from "luxon";
import Header from "~/components/Header";

import { getTransplantDates } from "~/data/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Heart Transplant Waiting List" },
    { name: "description", content: "Status 1A Blood Type B and O" },
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
      <h2 className="text-center text-2xl py-2">Past Transplant Data</h2>
      <div className="py-5 flex justify-center">
        <ul className="space-y-2">
          {dates.map((date: any, index: number) => (
            <li key={index}>
              <Link to={`/day/${date.report_date}`}>
                {date.report_date} (
                {
                  DateTime.fromFormat(date.report_date, "yyyy-MM-dd")
                    .weekdayLong
                }
                )
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="py-5 grid justify-center text-center">
        <h2 className="py-2 font-semibold text-3xl">What Region Am I In?</h2>
        <p>
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
        <h2 className="py-2 font-semibold text-3xl">
          Transplant Data Analysis?
        </h2>
        <p>
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
