import { test, expect } from "@playwright/test";
import { getBaseUrl } from "playwright.config";

test.describe("End To End Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test("Home Page", async ({ page }) => {
    // Verify list of dates
    await page.getByTestId(`report-date-2025-01-15`).isVisible();
    await expect(page.getByTestId(`report-date-2025-01-15`)).toHaveAttribute(
      "href",
      "/day/2025-01-15?waitListType=All+Types"
    );
    // verify refresh information
    await expect(page.getByTestId("data-refresh-text")).toBeVisible();
    await expect(page.getByTestId("data-refresh-text")).toHaveText(
      "Data is not updated on Saturday/Sunday*Data is updated at 8:00 am EST Monday-Friday*Access up to the past 1 years worth of data*"
    );

    // verify region tutorial
    await expect(page.getByTestId("region-header")).toBeVisible();
    await expect(page.getByTestId("region-header")).toHaveText(
      "What Region Am I In?"
    );
    await expect(page.getByTestId("region-information")).toBeVisible();
    await expect(page.getByTestId("region-information")).toHaveText(
      "Aside from accrued time on the waitlist, distance is an important factor. It's important to know what region you are in so you can see how many others in your general area are waiting for the same organ."
    );
    // verify analytics tutorial
    await expect(page.getByTestId("analysis-header")).toBeVisible();
    await expect(page.getByTestId("analysis-header")).toHaveText(
      "Transplant Data Analysis?"
    );
    await expect(page.getByTestId("analysis-information")).toBeVisible();
    await expect(page.getByTestId("analysis-information")).toHaveText(
      `We make our best attempt to analyze the waiting list data to determine if there has been a transplant or if patients are moving around the waiting list to different statuses. Without the actual data, these are only best guesses, guesses that we can confidently say are more right than wrong just by looking at data patterns. In cases where we claim a patient receieved a transplant, there are really a few options. 1. The patient actually receives the transplant. 2. The patient goes home without needing a transplant and has made a full recovery. 3. The patient did not make it and is no longer on the waiting list. Since 2 of the 3 are good outcomes, we "assume" that the patient got a transplant. Again, without the realtime data, we don't know for sure. I hope you all find this helpful as you navigate through your transplant journey.`
    );

    await expect(page.getByTestId("chart-region-1")).toHaveAttribute(
      "href",
      "/charts/1"
    );
    await expect(page.getByTestId("Connecticut")).toBeVisible();
    await expect(page.getByTestId("Maine")).toBeVisible();
    await expect(page.getByTestId("Massachusetts")).toBeVisible();
    await expect(page.getByTestId("New Hampshire")).toBeVisible();
    await expect(page.getByTestId("Rhode Island")).toBeVisible();
  });
  test("Open Specific Days Data", async ({ page }) => {
    await page.getByTestId(`report-date-2025-01-15`).click();
    await expect(page).toHaveURL(
      `${getBaseUrl()}/day/2025-01-15?waitListType=All+Types`
    );
  });
  test("Open Region Chart From Region Information", async ({ page }) => {
    await expect(page.getByTestId(`chart-region-2`)).toHaveAttribute(
      "href",
      "/charts/2"
    );
    await page.getByTestId(`chart-region-2`).click();
    await expect(page).toHaveURL(/.*charts\/2/);
    await expect(page.getByTestId("chart-region-2-heading")).toHaveText(
      "Region 2"
    );
  });
  test("Today Page", async () => {
    // go to todays page
    // verify date format for todays date
    // change each wait list status and make sure the data is loaded and lable is updated
    // make sure the data refresh dates text is showing
    // make sure the region text is showing
    // make sure smart analytic elements exists
  });
  test("Yesterday Page", async () => {
    // go to yesterday page
    // check the date.
  });
  test("USA Charts", async () => {
    // go to usa charts page and make sure all charts load and are visible
  });
  test("Region Charts", async () => {
    // go to specific region chart from today page and make sure each chart is visible
  });
  test("Verify Region Info Popovers", async () => {
    // go to todays page
    // click icon and make sure list is visible
    // click icon and make sure list is not visible
    // verify all states for each region when the list is open
  });
  test("Favorite/Unfavorite Region", async () => {
    // go to todays page
    // favorite a region
    // unfavorite a region
    // check start icon
    // check text color
  });
  test("Verify Center Count", async () => {
    // get count from the database
    // for a specific day verify the center count
    // make sure count for today is not zero
  });
  test("Verify Center Count Todays Page", async () => {
    // get count from the database
    // go to todays page
    // make sure count for today matches the db
  });
  test("Verify Region Counts and Trends", async () => {
    // for a specific day, check all region counts and trends
    // do this for each wait list type, 1a, 1b, 2, 7 and check all numbers
  });
  test("Verify Footer Elements", async () => {
    // buy me a coffe
    // email link
  });
});
