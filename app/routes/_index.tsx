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
      <div className="text-center py-2 space-y-2">
        <p>
          <span className="italic">
            Data is not updated on Saturday/Sunday*
          </span>
        </p>
        <p>
          <span className="italic">
            Access up to the past 1 years worth of data*
          </span>
        </p>
      </div>
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
    </>
  );
}

export async function loader({}: LoaderFunctionArgs) {
  const dates = await getTransplantDates();

  return { dates };
}
