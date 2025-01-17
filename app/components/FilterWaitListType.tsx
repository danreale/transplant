import { useSearchParams } from "@remix-run/react";

export default function FilterWaitListType({
  params,
}: {
  params: URLSearchParams;
}) {
  const [, setSearchParams] = useSearchParams();
  return (
    <>
      <div className="grid justify-center text-center py-5">
        {/* <Form> */}
        <div className="grid justify-center text-center">
          <div className="grid justify-center text-center">
            <label htmlFor="" className="font-bold py-1">
              Choose Wait List Type
            </label>
            <select
              name="waitListType"
              id="waitListType"
              data-testid="waitListType"
              className="text-center"
              defaultValue={params.get("waitListType") || "All Types"}
              onChange={(e) => {
                setSearchParams((prev) => {
                  prev.set("waitListType", e.target.value);
                  return prev;
                });
              }}
            >
              <option value="Heart Status 1A">Heart Status 1A</option>
              <option value="Heart Status 1B">Heart Status 1B</option>
              <option value="Heart Status 2">Heart Status 2</option>
              <option value="Heart Status 7 (Inactive)">
                Heart Status 7 (Inactive)
              </option>
              <option value="All Types">All Types</option>
            </select>
          </div>

          {/* <button
            type="submit"
            className="text-blue-500 font-bold border-2 border-blue-500 rounded-xl"
          >
            Filter
          </button> */}
        </div>
        {/* </Form> */}
      </div>

      <p
        className="text-center text-rose-500 font-bold py-5"
        data-testid="selectedWaitListType"
      >
        {params.get("waitListType")}
      </p>
    </>
  );
}
