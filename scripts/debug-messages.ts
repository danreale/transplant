import "dotenv/config";
import { getRealisticSmartChangeData } from "../app/data/change-data-smart.server";

// Read-only debug tool: prints the smart messages that would be generated for a
// given date pair, without needing to load the full site. Does not write anything.
//
// Usage: npx tsx scripts/debug-messages.ts <todaysDate> <yesterdaysDate>
// Dates are yyyy-MM-dd, matching report_date in the transplant_data table.

async function main() {
  const [todaysDate, yesterdaysDate] = process.argv.slice(2);

  if (!todaysDate || !yesterdaysDate) {
    console.error(
      "Usage: npx tsx scripts/debug-messages.ts <todaysDate> <yesterdaysDate>"
    );
    process.exit(1);
  }

  const regionChanges = await getRealisticSmartChangeData(
    todaysDate,
    yesterdaysDate
  );

  for (const region of regionChanges) {
    console.log(`\n=== ${region.region} ===`);
    if (region.messages.length === 0) {
      console.log("  (no messages)");
    }
    region.messages.forEach((message, index) => {
      console.log(`  [${index}] (${message.tone}) ${message.text}`);
    });
  }
}

main();
