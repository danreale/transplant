import { Link, useNavigation } from "@remix-run/react";

import Header from "~/components/Header";
import { regionStates } from "~/data/states";

export default function Index() {
  const transition = useNavigation();
  const pageLoading = transition.state !== "idle";

  return (
    <>
      <Header />
      {pageLoading && (
        <div className="flex justify-center items-center text-center text-yellow-400 text-3xl pb-5">
          Transplant Data Loading.....
        </div>
      )}
      <h2 className="text-center text-2xl py-2">Region Charts</h2>
      <div className="py-5 flex justify-center">
        <ul className="space-y-5">
          <li key={1} className="text-center">
            <Link to={`/charts/1`}>Region 1</Link>
            <p>({regionStates(1).join(", ")})</p>
          </li>
          <li key={2} className="text-center">
            <Link to={`/charts/2`}>Region 2</Link>
            <p>({regionStates(2).join(", ")})</p>
          </li>
          <li key={3} className="text-center">
            <Link to={`/charts/3`}>Region 3</Link>
            <p>({regionStates(3).join(", ")})</p>
          </li>
          <li key={4} className="text-center">
            <Link to={`/charts/4`}>Region 4</Link>
            <p>({regionStates(4).join(", ")})</p>
          </li>
          <li key={5} className="text-center">
            <Link to={`/charts/5`}>Region 5</Link>
            <p>({regionStates(5).join(", ")})</p>
          </li>
          <li key={6} className="text-center">
            <Link to={`/charts/6`}>Region 6</Link>
            <p>({regionStates(6).join(", ")})</p>
          </li>
          <li key={7} className="text-center">
            <Link to={`/charts/7`}>Region 7</Link>
            <p>({regionStates(7).join(", ")})</p>
          </li>
          <li key={8} className="text-center">
            <Link to={`/charts/8`}>Region 8</Link>
            <p>({regionStates(8).join(", ")})</p>
          </li>
          <li key={9} className="text-center">
            <Link to={`/charts/9`}>Region 9</Link>
            <p>({regionStates(9).join(", ")})</p>
          </li>
          <li key={10} className="text-center">
            <Link to={`/charts/10`}>Region 10</Link>
            <p>({regionStates(10).join(", ")})</p>
          </li>
          <li key={11} className="text-center">
            <Link to={`/charts/11`}>Region 11</Link>
            <p>({regionStates(11).join(", ")})</p>
          </li>
        </ul>
      </div>
    </>
  );
}
