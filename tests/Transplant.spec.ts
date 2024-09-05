import { test, expect } from "@playwright/test";
import fs from "fs";
import { DateTime } from "luxon";

test("Get Transplant Numbers", async ({ page }) => {
  await page.goto("/data/view-data-reports/build-advanced");
  await page
    .getByLabel("Donor Transplant Multiple")
    .selectOption("4;Waiting List");
  await page.waitForTimeout(1000);
  await page
    .getByLabel("Choose report columns 1 of 2")
    .selectOption("[ABO].members;ABO;5;ABO");
  await page.waitForTimeout(1000);

  await page
    .getByLabel("Choose report rows 1 of 3")
    .selectOption("[Region].members;Region of Center;12;Region");
  await page.waitForTimeout(1000);
  await page
    .getByLabel("Choose report rows 2 of 3")
    .selectOption("[Organ Custom].members;Waiting List Status;59;Organ Custom");
  await page.waitForTimeout(1000);
  await page
    .getByLabel("Choose report rows 3 of 3")
    .selectOption("[Waiting Time].members;Waiting Time;8;Waiting Time");
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

test("Get Center Numbers", async ({ page }) => {
  await page.goto("/data/view-data-reports/center-data");
  await page.waitForTimeout(1000);
  await page
    .getByLabel("Choose a State")
    .selectOption("PA;Pennsylvania;11;Area;Region");
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Go" }).click();
  await page.waitForTimeout(3000);
  await page
    .getByLabel("Choose Center:")
    .selectOption(
      "PACP-TX1 Children's Hospital of Philadelphia;PACP-TX1 Children's Hospital of Philadelphia;305;TXC;TXC"
    );
  await page.waitForTimeout(1000);
  await page.getByLabel("Choose Category:").selectOption("4;Waiting List");
  await page.waitForTimeout(1000);
  await page.getByRole("link", { name: "Overall by Organ" }).click();
  await page.waitForTimeout(5000);
  const heartCount = await page
    .locator("#reportData > tbody > tr > td:nth-child(6)")
    .innerText();
  console.log(heartCount);

  const todaysDate = DateTime.now()
    .setZone("America/New_York")
    .toFormat("yyyy-MM-dd");
  console.log(todaysDate);

  const heartData = { heart: parseInt(heartCount), report_date: todaysDate };

  fs.writeFile(
    "CenterHeartCount.json",
    JSON.stringify(heartData, null, 2),
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Created new center report date file successfully");
      }
    }
  );
});

test("Get Donor Numbers", async ({ page }) => {
  await page.goto("/data/view-data-reports/build-advanced");
  await page.getByLabel("Donor Transplant Multiple").selectOption("1;Donor");
  await page.waitForTimeout(1000);
  await page
    .getByLabel("Choose report columns 1 of 2")
    .selectOption("[ABO].members;Donor ABO;5;ABO");
  await page.waitForTimeout(1000);

  await page
    .getByLabel("Choose report rows 1 of 3")
    .selectOption("[Gender].members;Donor Birth Sex;3;Gender");
  await page.waitForTimeout(1000);
  await page
    .getByLabel("Choose report rows 2 of 3")
    .selectOption("[Ethnicity].members;Donor Race/Ethnicity;9;Ethnicity");
  await page.waitForTimeout(1000);

  await page
    .getByLabel("Organ", { exact: true })
    .selectOption("[Measures].[Heart];Heart;28;Count");
  await page.waitForTimeout(1000);
  await page.getByLabel("Age").selectOption("Pediatric;Pediatric; 0;Age");
  await page.waitForTimeout(1000);
  await page
    .getByLabel("Year")
    .selectOption("[Donation Year].[2024];2024;38;Donation Year");
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Go" }).click();
  await page.waitForTimeout(5000);

  const rows = await page.locator("#reportData > tbody > tr").count();
  console.log("Rows", rows);
  expect(rows).toBeGreaterThan(5);

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#tool_export").first().click();
  const download = await downloadPromise;

  // Wait for the download process to complete and save the downloaded file somewhere.
  await download.saveAs("DonorList.csv");
});
