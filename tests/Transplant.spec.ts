import { test, expect } from "@playwright/test";
import fs from "fs";

test("Get Transplant Numbers", async ({ page }) => {
  await page.goto("/data/view-data-reports/build-advanced");
  await page
    .getByLabel("Donor Transplant Multiple")
    .selectOption("4;Waiting List");
  await page.waitForTimeout(1000);
  await page
    .getByLabel("Choose report columns 1 of 2")
    .selectOption("[Organ Custom].members;Waiting List Status;59;Organ Custom");
  await page.waitForTimeout(1000);

  await page
    .getByLabel("Choose report rows 1 of 3")
    .selectOption("[Region].members;Region of Center;12;Region");
  await page.waitForTimeout(1000);
  await page
    .getByLabel("Choose report rows 2 of 3")
    .selectOption("[ABO].members;ABO;5;ABO");
  await page.waitForTimeout(1000);

  await page
    .getByLabel("Organ", { exact: true })
    .selectOption("Heart;Heart;8;Organ;Organ");
  await page.waitForTimeout(1000);
  await page.getByLabel("Age").selectOption("Pediatric;Pediatric; 0;Age");
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Go" }).click();
  await page.waitForTimeout(5000);

  const rows = await page.locator("#reportData > tbody > tr").count();
  console.log("Rows", rows);
  expect(rows).toBeGreaterThan(5);

  const reportDate = await page.locator(".footnote").first().innerText();

  const strParser = reportDate.split(" through ");
  const endStr = strParser[1];
  const dateStr = endStr.split(".");
  const lastReportUpdate = dateStr[0];
  console.log("Last Report Date", lastReportUpdate);

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#tool_export").first().click();
  const download = await downloadPromise;

  // Wait for the download process to complete and save the downloaded file somewhere.
  await download.saveAs("WaitingList.csv");

  fs.writeFile("LastReportDate.txt", lastReportUpdate, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Created new report date file successfully");
    }
  });
});
