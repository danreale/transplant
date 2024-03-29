import { Link } from "@remix-run/react";

export default function Header({}) {
  return (
    <>
      <div className="text-center py-5">
        <Link to="/">
          <h1 className="text-4xl py-2">
            Heart Transplant Wait List For Status 1A
          </h1>
        </Link>

        <ul className="py-2 space-y-2">
          <li>
            <Link to="/today">Today</Link>
          </li>
          <li>
            <Link to="/yesterday">Yesterday</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
