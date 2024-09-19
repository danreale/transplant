import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import { DateTime } from "luxon";
import Header from "~/components/Header";
import RegionStates from "~/components/RegionStates";

import { getTransplantDates } from "~/data/db.server";
import { regionStates } from "~/data/states";

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

        <RegionStates region={1} />
        <RegionStates region={2} />
        <RegionStates region={3} />
        <RegionStates region={4} />
        <RegionStates region={5} />
        <RegionStates region={6} />
        <RegionStates region={7} />
        <RegionStates region={8} />
        <RegionStates region={9} />
        <RegionStates region={10} />
        <RegionStates region={11} />
      </div>
    </>
  );
}

export async function loader({}: LoaderFunctionArgs) {
  const dates = await getTransplantDates();

  return { dates };
}
