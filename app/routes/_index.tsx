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
        <h2 className="py-2 font-semibold text-3xl" data-testid="status-header">
          What Do The Statuses Mean?
        </h2>
        <p data-testid="status-information" className="max-w-2xl">
          You'll see kids on this list grouped into Status 1A, 1B, 2, or 7
          (Inactive). Here's what that actually means. Status 1A is the most
          urgent, these are kids in the hospital right now, usually hooked up
          to machines or medication just to keep their heart going. Status 1B
          is still serious, but a step down, they usually need some ongoing
          medicine or support, just not the same critical, hospital-bound
          situation as 1A. Status 2 covers everyone else who's listed and
          waiting but doesn't currently meet the 1A or 1B criteria, they still
          need a new heart, they're just more stable for now. Status 7
          (Inactive) means a child is on the list but can't receive a
          transplant at this moment, maybe they have an infection, or they're
          recovering from something else that has to be handled first. Once
          that clears up, they go back to being active. None of this replaces
          what your child's own medical team tells you, it's just here so the
          numbers on this site actually mean something when you're looking at
          them.
        </p>
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
