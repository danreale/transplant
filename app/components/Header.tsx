import { Link } from "@remix-run/react";

// export default function Header({}) {
//   return (
//     <>
//       <div className="text-center py-5">
//         <Link to="/">
//           <h1 className="text-4xl py-2" data-testid="nav-home">
//             Pediatric Heart Transplant Wait List Statistics
//           </h1>
//         </Link>

//         <ul className="py-2 space-y-2">
//           <li>
//             <Link to="/today?waitListType=All+Types" data-testid="nav-today">
//               Today
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/yesterday?waitListType=All+Types"
//               data-testid="nav-yesterday"
//             >
//               Yesterday
//             </Link>
//           </li>
//           <li>
//             <Link to="/charts" data-testid="nav-charts">
//               USA Charts
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// }

export default function Header({}) {
  return (
    <>
      <header className=" py-4 space-y-5">
        <div className="flex text-center justify-center mx-4">
          {/* Application Name */}
          <h1 className="text-red-600 text-4xl font-bold">
            {" "}
            <Link to="/">
              <h1 className="" data-testid="nav-home">
                Pediatric Heart Transplant Wait List Statistics
              </h1>
            </Link>
          </h1>

          {/* Navigation Links */}
        </div>
        <div className="flex flex-row items-center justify-center mx-4 border-b border-gray-700 pb-4">
          <nav className="flex flex-row space-x-4">
            <Link
              to="/today?waitListType=All+Types"
              data-testid="nav-today"
              className="text-black font-medium hover:text-red-600 hover:bg-gray-200 hover:underline hover:font-bold hover:rounded-lg hover:border-x-4"
            >
              Today
            </Link>
            <Link
              to="/yesterday?waitListType=All+Types"
              data-testid="nav-yesterday"
              className="text-black font-medium hover:text-red-600 hover:bg-gray-300 hover:underline hover:font-bold hover:rounded-lg hover:border-x-4"
            >
              {" "}
              Yesterday
            </Link>

            <Link
              to="/charts"
              data-testid="nav-charts"
              className="text-black font-medium hover:text-red-600 hover:bg-gray-300 hover:underline hover:font-bold hover:rounded-lg hover:border-x-4"
            >
              USA Charts
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
