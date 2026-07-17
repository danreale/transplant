import "dotenv/config";
import { DateTime } from "luxon";
import { createClient } from "@supabase/supabase-js";

// One-off placeholder backfill: while the daily ETL pipeline is down, this
// duplicates each table's most recent real day's rows forward, one copy per
// missing date, up through today. Safe to re-run: it deletes any existing
// rows for a target date before inserting, so it won't create duplicates.
// Delete this script (or leave it as a rescue tool) once the pipeline is
// confirmed running again.

const TABLES: Record<string, { columns: string[] }> = {
  transplant_data: {
    columns: [
      "region",
      "wait_list_type",
      "wait_list_time",
      "blood_type_a",
      "blood_type_b",
      "blood_type_o",
      "blood_type_ab",
      "blood_type_all",
    ],
  },
  transplant_data_adult: {
    columns: [
      "region",
      "wait_list_type",
      "wait_list_time",
      "blood_type_a",
      "blood_type_b",
      "blood_type_o",
      "blood_type_ab",
      "blood_type_all",
    ],
  },
  donor_data: {
    columns: ["gender", "ethnicity", "blood_type_o", "blood_type_b"],
  },
  center_data: {
    columns: ["heart"],
  },
};

async function main() {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SECRET_KEY as string
  );

  const today = DateTime.now()
    .setZone("America/New_York")
    .toFormat("yyyy-MM-dd");

  for (const [table, { columns }] of Object.entries(TABLES)) {
    const { data: latestRows, error: latestError } = await supabase
      .from(table)
      .select("report_date")
      .order("report_date", { ascending: false })
      .limit(1);
    if (latestError) throw latestError;

    const latestDate = latestRows?.[0]?.report_date;
    if (!latestDate) {
      console.log(`${table}: no data at all, skipping`);
      continue;
    }

    let cursor = DateTime.fromISO(latestDate).plus({ days: 1 });
    const end = DateTime.fromISO(today);

    if (cursor > end) {
      console.log(`${table}: already up to date (latest=${latestDate})`);
      continue;
    }

    const { data: sourceRows, error: sourceError } = await supabase
      .from(table)
      .select(columns.join(","))
      .eq("report_date", latestDate);
    if (sourceError) throw sourceError;
    if (!sourceRows || sourceRows.length === 0) {
      console.log(`${table}: no source rows found for ${latestDate}, skipping`);
      continue;
    }

    console.log(
      `${table}: copying ${sourceRows.length} rows from ${latestDate} forward through ${today}`
    );

    while (cursor <= end) {
      const targetDate = cursor.toFormat("yyyy-MM-dd");

      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq("report_date", targetDate);
      if (deleteError) throw deleteError;

      const rowsToInsert = sourceRows.map((row) => ({
        ...row,
        report_date: targetDate,
      }));

      const { error: insertError } = await supabase
        .from(table)
        .insert(rowsToInsert);
      if (insertError) throw insertError;

      console.log(`  ${table} ${targetDate}: inserted ${rowsToInsert.length} rows`);
      cursor = cursor.plus({ days: 1 });
    }
  }

  console.log("\nBackfill complete.");
}

main();
