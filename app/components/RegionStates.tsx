import { Link } from "@remix-run/react";
import { regionStates } from "~/data/states";

type Props = {
  region: number;
  age: string;
  title?: boolean;
};

export default function RegionStates({ region, age, title = true }: Props) {
  return (
    <div className="flex justify-center items-center text-center py-2">
      <ul className="">
        <li key={region} className="text-center">
          {title && (
            <Link
              to={`/charts/${region}?ageGroupType=${age}`}
              className="underline text-xl"
            >
              Region {region}
            </Link>
          )}
          <ul>
            {regionStates(region).map((s) => (
              <li>{s}</li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
