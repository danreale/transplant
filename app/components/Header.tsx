import { Link } from "@remix-run/react";

export default function Header({}) {
  return (
    <>
      <div className="text-center py-5">
        <Link to="/">
          <h1 className="text-4xl py-2">
            Pediatric Heart Transplant Wait List Statistics
          </h1>
        </Link>

        <ul className="py-2 space-y-2">
          <li>
            <Link to="/today?waitListType=All+Types">Today</Link>
          </li>
          <li>
            <Link to="/yesterday?waitListType=All+Types">Yesterday</Link>
          </li>
          <li>
            <Link to="/charts/2">Region 2 Charts</Link>
          </li>
          <li>
            <Link to="/charts">Region Charts</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
