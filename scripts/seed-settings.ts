import "dotenv/config";
import { DateTime } from "luxon";
import { createClient } from "@supabase/supabase-js";

// One-off: transplant_settings has never had a row (confirmed empty), which
// crashes /today and /yesterday's "Based on data through..." line regardless
// of the daily ETL pipeline's status. Seeds a single row reflecting the most
// recent backfilled date so those pages render.

async function main() {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SECRET_KEY as string
  );

  const today = DateTime.now()
    .setZone("America/New_York")
    .toFormat("yyyy-MM-dd");
  const yesterday = DateTime.now()
    .setZone("America/New_York")
    .minus({ days: 1 })
    .toFormat("yyyy-MM-dd");

  const { data: existing } = await supabase
    .from("transplant_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (existing) {
    console.log("transplant_settings already has a row, not touching it:", existing);
    return;
  }

  const { data, error } = await supabase
    .from("transplant_settings")
    .insert({
      from_data_refresh_date: today,
      last_data_refresh_date: today,
      yesterday_from_data_refresh_date: yesterday,
      yesterday_last_data_refresh_date: yesterday,
    })
    .select();
  if (error) throw error;

  console.log("Inserted transplant_settings row:", data);
}

main();
