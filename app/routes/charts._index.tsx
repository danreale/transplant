import { Link, useNavigation } from "@remix-run/react";

import Header from "~/components/Header";

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
          <li key={1}>
            <Link to={`/charts/1`}>Region 1</Link>
          </li>
          <li key={2}>
            <Link to={`/charts/2`}>Region 2</Link>
          </li>
          <li key={3}>
            <Link to={`/charts/3`}>Region 3</Link>
          </li>
          <li key={4}>
            <Link to={`/charts/4`}>Region 4</Link>
          </li>
          <li key={5}>
            <Link to={`/charts/5`}>Region 5</Link>
          </li>
          <li key={6}>
            <Link to={`/charts/6`}>Region 6</Link>
          </li>
          <li key={7}>
            <Link to={`/charts/7`}>Region 7</Link>
          </li>
          <li key={8}>
            <Link to={`/charts/8`}>Region 8</Link>
          </li>
          <li key={9}>
            <Link to={`/charts/9`}>Region 9</Link>
          </li>
          <li key={10}>
            <Link to={`/charts/10`}>Region 10</Link>
          </li>
          <li key={11}>
            <Link to={`/charts/11`}>Region 11</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
