import { Link, useSearchParams } from "@remix-run/react";
import { useLayoutEffect, useState } from "react";

export default function Header({}) {
  const [ageGroup, setAgeGroup] = useState("Pediatric");
  const [, setSearchParams] = useSearchParams();

  function handleSetAgeGroup(age: string) {
    if (age === "Pediatric") {
      localStorage.setItem("ageGroup", "Pediatric");
      setAgeGroup("Pediatric");
    } else {
      localStorage.setItem("ageGroup", "Adult");
      setAgeGroup("Adult");
    }
  }
  useLayoutEffect(() => {
    const ageGroup = window.localStorage.getItem(`ageGroup`);
    if (ageGroup === "Adult") {
      localStorage.setItem("ageGroup", "Adult");
      setAgeGroup("Adult");
    } else {
      localStorage.setItem("ageGroup", "Pediatric");
      setAgeGroup("Pediatric");
    }
  }, []);

  return (
    <>
      <div className="text-center py-5">
        <Link to={`/?ageGroupType=${ageGroup}`}>
          <h1 className="text-4xl py-2">
            {ageGroup} Heart Transplant Wait List Statistics
          </h1>
        </Link>

        <button
          className="border-2 px-2 rounded-2xl border-yellow-500"
          onClick={() => {
            handleSetAgeGroup(ageGroup === "Adult" ? "Pediatric" : "Adult");
            setSearchParams((prev) => {
              prev.set(
                "ageGroupType",
                ageGroup === "Adult" ? "Pediatric" : "Adult"
              );
              prev.set("waitListType", "All Types");
              return prev;
            });
          }}
        >
          {ageGroup === "Adult" ? "View Pediatric" : "View Adult"}
        </button>

        <ul className="py-2 space-y-2">
          <li>
            <Link to={`/today?waitListType=All+Types&ageGroupType=${ageGroup}`}>
              Today
            </Link>
          </li>
          <li>
            <Link
              to={`/yesterday?waitListType=All+Types&ageGroupType=${ageGroup}`}
            >
              Yesterday
            </Link>
          </li>
          <li>
            <Link to="/charts">USA Charts</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
