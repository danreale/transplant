import { Link } from "@remix-run/react";

export default function Header({}) {
  return (
    <>
      <div className="text-center py-5">
        <Link to="/">
          <h1 className="text-4xl py-2" data-testid="nav-home">
            Pediatric Heart Transplant Wait List Statistics
          </h1>
        </Link>

        <ul className="py-2 space-y-2">
          <li>
            <Link to="/today?waitListType=All+Types" data-testid="nav-today">
              Today
            </Link>
          </li>
          <li>
            <Link
              to="/yesterday?waitListType=All+Types"
              data-testid="nav-yesterday"
            >
              Yesterday
            </Link>
          </li>
          <li>
            <Link to="/charts" data-testid="nav-charts">
              USA Charts
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
