import { test, expect, Page } from "@playwright/test";
import { getBaseUrl } from "playwright.config";
import { regionStates } from "~/data/states";

async function checkWaitListTypeFilter(page: Page) {
  // verify default selection
  await expect(page.getByTestId("waitListType")).toHaveValue("All Types");
  // make sure blood types are not blank
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-A")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-B")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-AB")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-O")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-All")
  ).not.toHaveText("");

  await page.getByTestId("waitListType").selectOption("Heart Status 1A");
  await page.waitForTimeout(1000);
  await expect(page.getByTestId("waitListType")).toHaveValue("Heart Status 1A");
  await expect(page.getByTestId("selectedWaitListType")).toHaveText(
    "Heart Status 1A"
  );

  // make sure blood types are not blank
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-A")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-B")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-AB")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-O")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-All")
  ).not.toHaveText("");

  await page.getByTestId("waitListType").selectOption("Heart Status 1B");
  await page.waitForTimeout(1000);
  await expect(page.getByTestId("waitListType")).toHaveValue("Heart Status 1B");
  await expect(page.getByTestId("selectedWaitListType")).toHaveText(
    "Heart Status 1B"
  );
  // make sure blood types are not blank
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-A")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-B")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-AB")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-O")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-All")
  ).not.toHaveText("");

  await page.getByTestId("waitListType").selectOption("Heart Status 2");
  await page.waitForTimeout(1000);
  await expect(page.getByTestId("waitListType")).toHaveValue("Heart Status 2");
  await expect(page.getByTestId("selectedWaitListType")).toHaveText(
    "Heart Status 2"
  );
  // make sure blood types are not blank
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-A")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-B")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-AB")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-O")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-All")
  ).not.toHaveText("");

  await page
    .getByTestId("waitListType")
    .selectOption("Heart Status 7 (Inactive)");
  await page.waitForTimeout(1000);
  await expect(page.getByTestId("waitListType")).toHaveValue(
    "Heart Status 7 (Inactive)"
  );
  await expect(page.getByTestId("selectedWaitListType")).toHaveText(
    "Heart Status 7 (Inactive)"
  );
  // make sure blood types are not blank
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-A")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-B")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-AB")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-O")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-All")
  ).not.toHaveText("");

  await page.getByTestId("waitListType").selectOption("All Types");
  await page.waitForTimeout(1000);
  await expect(page.getByTestId("waitListType")).toHaveValue("All Types");
  await expect(page.getByTestId("selectedWaitListType")).toHaveText(
    "All Types"
  );
  // make sure blood types are not blank
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-A")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-B")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-AB")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-O")
  ).not.toHaveText("");
  await expect(
    page.getByTestId("region-2-section").getByTestId("count-All")
  ).not.toHaveText("");
}
async function checkWaitListTimes(page: Page, times: number[]) {
  await expect(page.getByTestId("All Time")).toHaveText("All Time");
  await expect(page.getByTestId("All Time Count")).toHaveText(
    times[0].toString()
  );
  await expect(page.getByTestId("< 30 Days")).toHaveText("< 30 Days");
  await expect(page.getByTestId("< 30 Days Count")).toHaveText(
    times[1].toString()
  );
  await expect(page.getByTestId("30 to < 90 Days")).toHaveText(
    "30 to < 90 Days"
  );
  await expect(page.getByTestId("30 to < 90 Days Count")).toHaveText(
    times[2].toString()
  );
  await expect(page.getByTestId("90 Days to < 6 Months")).toHaveText(
    "90 Days to < 6 Months"
  );
  await expect(page.getByTestId("90 Days to < 6 Months Count")).toHaveText(
    times[3].toString()
  );
  await expect(page.getByTestId("6 Months to < 1 Year")).toHaveText(
    "6 Months to < 1 Year"
  );
  await expect(page.getByTestId("6 Months to < 1 Year Count")).toHaveText(
    times[4].toString()
  );
  await expect(page.getByTestId("1 Year to < 2 Years")).toHaveText(
    "1 Year to < 2 Years"
  );
  await expect(page.getByTestId("1 Year to < 2 Years Count")).toHaveText(
    times[5].toString()
  );
  await expect(page.getByTestId("2 Years to < 3 Years")).toHaveText(
    "2 Years to < 3 Years"
  );
  await expect(page.getByTestId("2 Years to < 3 Years Count")).toHaveText(
    times[6].toString()
  );
  await expect(page.getByTestId("3 Years to < 5 Years")).toHaveText(
    "3 Years to < 5 Years"
  );
  await expect(page.getByTestId("3 Years to < 5 Years Count")).toHaveText(
    times[7].toString()
  );
  await expect(page.getByTestId("5 or More Years")).toHaveText(
    "5 or More Years"
  );
  await expect(page.getByTestId("5 or More Years Count")).toHaveText(
    times[8].toString()
  );
}

test.describe("End To End Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId(`page-heading`)).toBeVisible();
    await expect(page.getByTestId(`page-heading`)).toHaveText(
      "Past Transplant Data"
    );
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

    // verift all regions
    await expect(page.getByTestId("chart-region-1")).toHaveAttribute(
      "href",
      "/charts/1"
    );
    await expect(page.getByTestId("Connecticut")).toBeVisible();
    await expect(page.getByTestId("Maine")).toBeVisible();
    await expect(page.getByTestId("Massachusetts")).toBeVisible();
    await expect(page.getByTestId("New Hampshire")).toBeVisible();
    await expect(page.getByTestId("Rhode Island")).toBeVisible();

    await expect(page.getByTestId("chart-region-2")).toHaveAttribute(
      "href",
      "/charts/2"
    );
    await expect(page.getByTestId("DC")).toBeVisible();
    await expect(page.getByTestId("Delaware")).toBeVisible();
    await expect(page.getByTestId("Maryland")).toBeVisible();
    await expect(page.getByTestId("New Jersey")).toBeVisible();
    await expect(page.getByTestId("Pennsylvania")).toBeVisible();
    await expect(page.getByTestId("West Virginia")).toBeVisible();

    await expect(page.getByTestId("chart-region-3")).toHaveAttribute(
      "href",
      "/charts/3"
    );
    await expect(page.getByTestId("Alabama")).toBeVisible();
    await expect(page.getByTestId("Arkansas")).toBeVisible();
    await expect(page.getByTestId("Florida")).toBeVisible();
    await expect(page.getByTestId("Georgia")).toBeVisible();
    await expect(page.getByTestId("Louisiana")).toBeVisible();
    await expect(page.getByTestId("Mississippi")).toBeVisible();
    await expect(page.getByTestId("Puerto Rico")).toBeVisible();

    await expect(page.getByTestId("chart-region-4")).toHaveAttribute(
      "href",
      "/charts/4"
    );
    await expect(page.getByTestId("Oklahoma")).toBeVisible();
    await expect(page.getByTestId("Texas")).toBeVisible();

    await expect(page.getByTestId("chart-region-5")).toHaveAttribute(
      "href",
      "/charts/5"
    );
    await expect(page.getByTestId("Arizona")).toBeVisible();
    await expect(page.getByTestId("California")).toBeVisible();
    await expect(page.getByTestId("Nevada")).toBeVisible();
    await expect(page.getByTestId("New Mexico")).toBeVisible();
    await expect(page.getByTestId("Utah")).toBeVisible();

    await expect(page.getByTestId("chart-region-6")).toHaveAttribute(
      "href",
      "/charts/6"
    );
    await expect(page.getByTestId("Alaska")).toBeVisible();
    await expect(page.getByTestId("Hawaii")).toBeVisible();
    await expect(page.getByTestId("Idaho")).toBeVisible();
    await expect(page.getByTestId("Montana")).toBeVisible();
    await expect(page.getByTestId("Oregon")).toBeVisible();
    await expect(page.getByTestId("Washington")).toBeVisible();

    await expect(page.getByTestId("chart-region-7")).toHaveAttribute(
      "href",
      "/charts/7"
    );
    await expect(page.getByTestId("Illinois")).toBeVisible();
    await expect(page.getByTestId("Minnesota")).toBeVisible();
    await expect(page.getByTestId("North Dakota")).toBeVisible();
    await expect(page.getByTestId("South Dakota")).toBeVisible();
    await expect(page.getByTestId("Wisconsin")).toBeVisible();

    await expect(page.getByTestId("chart-region-8")).toHaveAttribute(
      "href",
      "/charts/8"
    );
    await expect(page.getByTestId("Colorado")).toBeVisible();
    await expect(page.getByTestId("Iowa")).toBeVisible();
    await expect(page.getByTestId("Kansas")).toBeVisible();
    await expect(page.getByTestId("Missouri")).toBeVisible();
    await expect(page.getByTestId("Nebraska")).toBeVisible();
    await expect(page.getByTestId("Wyoming")).toBeVisible();

    await expect(page.getByTestId("chart-region-9")).toHaveAttribute(
      "href",
      "/charts/9"
    );
    await expect(page.getByTestId("New York")).toBeVisible();
    await expect(page.getByTestId("Vermont")).toBeVisible();

    await expect(page.getByTestId("chart-region-10")).toHaveAttribute(
      "href",
      "/charts/10"
    );
    await expect(page.getByTestId("Indiana")).toBeVisible();
    await expect(page.getByTestId("Michigan")).toBeVisible();
    await expect(page.getByTestId("Ohio")).toBeVisible();

    await expect(page.getByTestId("chart-region-11")).toHaveAttribute(
      "href",
      "/charts/11"
    );
    await expect(page.getByTestId("Kentucky")).toBeVisible();
    await expect(page.getByTestId("North Carolina")).toBeVisible();
    await expect(page.getByTestId("South Carolina")).toBeVisible();
    await expect(page.getByTestId("Tennessee")).toBeVisible();
    await expect(page.getByTestId("Virginia")).toBeVisible();
  });
  test("Open Specific Days Data", async ({ page }) => {
    await page.getByTestId(`report-date-2025-01-15`).click();
    await expect(page).toHaveURL(
      `${getBaseUrl()}/day/2025-01-15?waitListType=All+Types`
    );
    await expect(page.getByTestId(`page-heading`)).toHaveText("Day's Data");
  });
  test("Open Region Chart From Region Information", async ({ page }) => {
    await expect(page.getByTestId(`chart-region-2`)).toHaveAttribute(
      "href",
      "/charts/2"
    );
    await page.getByTestId(`chart-region-2`).click();
    await expect(page).toHaveURL(`${getBaseUrl()}/charts/2`);
    await expect(page.getByTestId("chart-region-2-heading")).toHaveText(
      "Region 2"
    );
  });
  test("Navigation Links", async ({ page }) => {
    // today
    await page.getByTestId("nav-today").click();
    await expect(page.getByTestId("page-heading")).toHaveText("Today's Data");
    await expect(page).toHaveURL(
      `${getBaseUrl()}/today?waitListType=All+Types`
    );
    // yesterday
    await page.getByTestId("nav-yesterday").click();
    await expect(page.getByTestId("page-heading")).toHaveText(
      "Yesterday's Data"
    );
    await expect(page).toHaveURL(
      `${getBaseUrl()}/yesterday?waitListType=All+Types`
    );
    // charts
    await page.getByTestId("nav-charts").click();
    await expect(page.getByTestId("page-heading")).toHaveText("Region Charts");
    await expect(page).toHaveURL(`${getBaseUrl()}/charts`);
    // home
    await page.getByTestId("nav-home").click();
    await expect(page.getByTestId("page-heading")).toHaveText(
      "Past Transplant Data"
    );
    await expect(page).toHaveURL(`${getBaseUrl()}/`);
  });
  test("Today Page", async ({ page }) => {
    // go to todays page
    await page.getByTestId("nav-today").click();
    await expect(page.getByTestId("page-heading")).toHaveText("Today's Data");
    await expect(page).toHaveURL(
      `${getBaseUrl()}/today?waitListType=All+Types`
    );
    // verify date format for todays date
    await expect(page.getByTestId("todaysDate")).toBeVisible();
    await expect(page.getByTestId("noDataMessage")).not.toBeVisible();
    await expect(page.getByTestId("refreshDate")).toBeVisible();
    // change each wait list status and make sure the data is loaded and lable is updated
    // make sure each blood type has data any is not blank
    await checkWaitListTypeFilter(page);
  });
  test("Yesterday Page", async ({ page }) => {
    await page.getByTestId("nav-yesterday").click();
    await expect(page.getByTestId("page-heading")).toHaveText(
      "Yesterday's Data"
    );
    await expect(page).toHaveURL(
      `${getBaseUrl()}/yesterday?waitListType=All+Types`
    );
    await checkWaitListTypeFilter(page);
  });
  test("Days Page", async ({ page }) => {
    await page.getByTestId(`report-date-2024-11-04`).click();
    await expect(page).toHaveURL(
      `${getBaseUrl()}/day/2024-11-04?waitListType=All+Types`
    );
    await expect(page.getByTestId(`page-heading`)).toHaveText("Day's Data");
    await checkWaitListTypeFilter(page);
  });
  test("USA Charts", async ({ page }) => {
    // go to usa charts page and make sure all charts load and are visible
    await page.getByTestId("nav-charts").click();
    await expect(page.getByTestId("page-heading")).toHaveText("Region Charts");
    await expect(page).toHaveURL(`${getBaseUrl()}/charts`);

    // blood type
    await expect(page.getByTestId("Chart-Blood-Type-Title")).toBeVisible();
    await expect(page.locator("#chart-blood-type")).toBeVisible();
    // wait list type
    await expect(page.getByTestId("Chart-Wait-List-Type-Title")).toBeVisible();
    await expect(page.locator("#chart-wait-list-status")).toBeVisible();
  });

  const regions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  for (const region of regions) {
    test(`Region Charts - Region ${region}`, async ({ page }) => {
      // go to specific region chart from today page and make sure each chart is visible
      await page.getByTestId("nav-today").click();
      await expect(page.getByTestId("page-heading")).toHaveText("Today's Data");
      await expect(page).toHaveURL(
        `${getBaseUrl()}/today?waitListType=All+Types`
      );

      await expect(
        page.getByTestId(`view-trends-region${region}`)
      ).toBeVisible();
      await expect(
        page.getByTestId(`view-trends-region${region}`)
      ).toHaveAttribute("href", `/charts/${region}`);

      await page.getByTestId(`view-trends-region${region}`).click();
      await expect(page).toHaveURL(`${getBaseUrl()}/charts/${region}`);
      await expect(
        page.getByTestId(`chart-region-${region}-heading`)
      ).toHaveText(`Region ${region}`);

      // blood type
      await expect(page.getByTestId("Chart-Blood-Type-Title")).toBeVisible();
      await expect(page.getByTestId("Chart-Blood-Type-Title")).toHaveText(
        "Blood Types"
      );
      await expect(page.locator("#chart-blood-type")).toBeVisible();
      // wait list type
      await expect(
        page.getByTestId("Chart-Wait-List-Type-Title")
      ).toBeVisible();
      await expect(page.getByTestId("Chart-Wait-List-Type-Title")).toHaveText(
        "Wait List Types"
      );
      await expect(page.locator("#chart-wait-list-status")).toBeVisible();

      if (region === 2) {
        // center data
        await expect(page.getByTestId("Chart-Center-Title")).toBeVisible();
        await expect(page.getByTestId("Chart-Center-Title")).toHaveText("CHOP");
        await expect(page.locator("#chart-center-data")).toBeVisible();
      }
      const rs = regionStates(region);
      for (let index = 0; index < rs.length; index++) {
        const state = rs[index];
        await expect(page.getByTestId(state)).toBeVisible();
      }
    });
  }

  test("Favorite/Unfavorite Region", async ({ page }) => {
    // go to todays page
    await page.getByTestId("nav-today").click();
    await expect(page.getByTestId("page-heading")).toHaveText("Today's Data");
    await expect(page).toHaveURL(
      `${getBaseUrl()}/today?waitListType=All+Types`
    );
    // favorite a region
    await expect(page.getByTestId("region1NoStar")).toBeVisible();
    await expect(page.getByTestId("region1NotFavorited")).toBeVisible();
    await page.getByTestId("favorite-region-1").click();
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("region1Star")).toBeVisible();
    await expect(page.getByTestId("region1Favorited")).toBeVisible();
    const localStorage = await page.context().storageState();
    expect(localStorage.origins[0].localStorage).toEqual([
      { name: "Region1", value: "true" },
    ]);
    // unfavorite a region
    await page.getByTestId("favorite-region-1").click();
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("region1NoStar")).toBeVisible();
    await expect(page.getByTestId("region1NotFavorited")).toBeVisible();
    const localStorageAfter = await page.context().storageState();
    expect(localStorageAfter.origins).toEqual([]);
  });
  test("Verify Center Count Todays Page", async ({ page }) => {
    // go to todays page
    await page.getByTestId("nav-today").click();
    await expect(page.getByTestId("page-heading")).toHaveText("Today's Data");
    await expect(page).toHaveURL(
      `${getBaseUrl()}/today?waitListType=All+Types`
    );
    // verify counts are visible
    await expect(page.getByTestId("todaysCenterCount")).toContainText(
      "Today's Center Count"
    );
    expect(
      parseInt(await page.getByTestId("todayCount").innerText())
    ).toBeGreaterThan(0);
    await expect(page.getByTestId("yesterdaysCenterCount")).toContainText(
      "Yesterday's Center Count"
    );
    expect(
      parseInt(await page.getByTestId("yesterdayCount").innerText())
    ).toBeGreaterThan(0);
  });
  test("Verify Center Count Yesterdays Page", async ({ page }) => {
    // go to todays page
    await page.getByTestId("nav-yesterday").click();
    await expect(page.getByTestId("page-heading")).toHaveText(
      "Yesterday's Data"
    );
    await expect(page).toHaveURL(
      `${getBaseUrl()}/yesterday?waitListType=All+Types`
    );
    // verify counts are visible
    await expect(page.getByTestId("todaysCenterCount")).toContainText(
      "Today's Center Count"
    );
    expect(
      parseInt(await page.getByTestId("todayCount").innerText())
    ).toBeGreaterThan(0);
    await expect(page.getByTestId("yesterdaysCenterCount")).toContainText(
      "Yesterday's Center Count"
    );
    expect(
      parseInt(await page.getByTestId("yesterdayCount").innerText())
    ).toBeGreaterThan(0);
  });
  test("Verify Center Count Days Page", async ({ page }) => {
    // go to days page
    await page.getByTestId(`report-date-2025-01-15`).isVisible();
    await expect(page.getByTestId(`report-date-2025-01-15`)).toHaveAttribute(
      "href",
      "/day/2025-01-15?waitListType=All+Types"
    );
    await page.getByTestId(`report-date-2025-01-15`).click();
    await expect(page.getByTestId("page-heading")).toHaveText("Day's Data");
    await expect(page).toHaveURL(
      `${getBaseUrl()}/day/2025-01-15?waitListType=All+Types`
    );
    // verify counts are visible
    await expect(page.getByTestId("todaysCenterCount")).toContainText(
      "Today's Center Count"
    );
    expect(
      parseInt(await page.getByTestId("todayCount").innerText())
    ).toBeGreaterThan(0);
    await expect(page.getByTestId("yesterdaysCenterCount")).toContainText(
      "Yesterday's Center Count"
    );
    expect(
      parseInt(await page.getByTestId("yesterdayCount").innerText())
    ).toBeGreaterThan(0);
  });
  test("Verify Region Information", async ({ page }) => {
    // go to todays page
    await page.getByTestId("nav-today").click();
    await expect(page.getByTestId("page-heading")).toHaveText("Today's Data");
    await expect(page).toHaveURL(
      `${getBaseUrl()}/today?waitListType=All+Types`
    );
    // check region info
    await expect(page.getByTestId(`region-2-info`)).toBeVisible();
    await page.getByTestId(`region-2-info`).click({ force: true });
    await page.waitForTimeout(1000);
    await expect(page.getByTestId(`region-2-popover`)).toBeVisible();
    await expect(page.getByTestId(`DC`)).toBeVisible();
    await expect(page.getByTestId(`Delaware`)).toBeVisible();
    await expect(page.getByTestId(`Maryland`)).toBeVisible();
    await expect(page.getByTestId(`New Jersey`)).toBeVisible();
    await expect(page.getByTestId(`Pennsylvania`)).toBeVisible();
    await expect(page.getByTestId(`West Virginia`)).toBeVisible();
    await page.getByTestId(`region-2-info`).click({ force: true });
  });
  test("Verify Region Counts and Trends", async ({ page }) => {
    // for a specific day, check all region counts and trends
    // do this for each wait list type, 1a, 1b, 2, 7 and check all numbers
    await page.getByTestId(`report-date-2024-11-04`).click();
    await expect(page).toHaveURL(
      `${getBaseUrl()}/day/2024-11-04?waitListType=All+Types`
    );

    await expect(page.getByTestId("waitListType")).toHaveValue("All Types");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-A")
    ).toHaveText("11");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-B")
    ).toHaveText("9");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-AB")
    ).toHaveText("0");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-O")
    ).toHaveText("28");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-All")
    ).toHaveText("48");

    await page.getByTestId("waitListType").selectOption("Heart Status 1A");
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("waitListType")).toHaveValue(
      "Heart Status 1A"
    );
    await expect(page.getByTestId("selectedWaitListType")).toHaveText(
      "Heart Status 1A"
    );
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-A")
    ).toHaveText("3");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-B")
    ).toHaveText("6");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-AB")
    ).toHaveText("0");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-O")
    ).toHaveText("7");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-All")
    ).toHaveText("16");

    await page.getByTestId("waitListType").selectOption("Heart Status 1B");
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("waitListType")).toHaveValue(
      "Heart Status 1B"
    );
    await expect(page.getByTestId("selectedWaitListType")).toHaveText(
      "Heart Status 1B"
    );
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-A")
    ).toHaveText("2");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-B")
    ).toHaveText("3");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-AB")
    ).toHaveText("0");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-O")
    ).toHaveText("14");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-All")
    ).toHaveText("19");

    await page.getByTestId("waitListType").selectOption("Heart Status 2");
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("waitListType")).toHaveValue(
      "Heart Status 2"
    );
    await expect(page.getByTestId("selectedWaitListType")).toHaveText(
      "Heart Status 2"
    );
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-A")
    ).toHaveText("3");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-B")
    ).toHaveText("0");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-AB")
    ).toHaveText("0");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-O")
    ).toHaveText("2");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-All")
    ).toHaveText("5");

    await page
      .getByTestId("waitListType")
      .selectOption("Heart Status 7 (Inactive)");
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("waitListType")).toHaveValue(
      "Heart Status 7 (Inactive)"
    );
    await expect(page.getByTestId("selectedWaitListType")).toHaveText(
      "Heart Status 7 (Inactive)"
    );
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-A")
    ).toHaveText("3");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-B")
    ).toHaveText("0");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-AB")
    ).toHaveText("0");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-O")
    ).toHaveText("5");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-All")
    ).toHaveText("8");

    await page.getByTestId("waitListType").selectOption("All Types");
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("waitListType")).toHaveValue("All Types");
    await expect(page.getByTestId("selectedWaitListType")).toHaveText(
      "All Types"
    );
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-A")
    ).toHaveText("11");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-B")
    ).toHaveText("9");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-AB")
    ).toHaveText("0");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-O")
    ).toHaveText("28");
    await expect(
      page.getByTestId("region-2-section").getByTestId("count-All")
    ).toHaveText("48");
  });
  test("Verify Blood Type Wait List Times", async ({ page }) => {
    await page.getByTestId(`report-date-2024-11-04`).click();
    await expect(page).toHaveURL(
      `${getBaseUrl()}/day/2024-11-04?waitListType=All+Types`
    );
    await expect(page.getByTestId(`page-heading`)).toHaveText("Day's Data");

    await expect(page.getByTestId("waitListType")).toHaveValue("All Types");
    await page.getByTestId("waitListType").selectOption("Heart Status 1A");
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("waitListType")).toHaveValue(
      "Heart Status 1A"
    );
    await expect(page.getByTestId("selectedWaitListType")).toHaveText(
      "Heart Status 1A"
    );

    await page
      .getByTestId("region-2-section")
      .getByTestId("bloodType-A-button")
      .click();
    await expect(page.getByTestId("popover-A")).toBeVisible();

    await checkWaitListTimes(page, [3, 0, 1, 1, 1, 0, 0, 0, 0]);

    await page
      .getByTestId("region-2-section")
      .getByTestId("bloodType-A-button")
      .click();
    await expect(page.getByTestId("popover-A")).not.toBeVisible();

    await page
      .getByTestId("region-2-section")
      .getByTestId("bloodType-B-button")
      .click();
    await expect(page.getByTestId("popover-B")).toBeVisible();

    await checkWaitListTimes(page, [6, 1, 2, 1, 2, 0, 0, 0, 0]);

    await page
      .getByTestId("region-2-section")
      .getByTestId("bloodType-B-button")
      .click();
    await expect(page.getByTestId("popover-B")).not.toBeVisible();

    await page
      .getByTestId("region-2-section")
      .getByTestId("bloodType-AB-button")
      .click();
    await expect(page.getByTestId("popover-AB")).toBeVisible();

    await checkWaitListTimes(page, [0, 0, 0, 0, 0, 0, 0, 0, 0]);

    await page
      .getByTestId("region-2-section")
      .getByTestId("bloodType-AB-button")
      .click();
    await expect(page.getByTestId("popover-AB")).not.toBeVisible();

    await page
      .getByTestId("region-2-section")
      .getByTestId("bloodType-O-button")
      .click();
    await expect(page.getByTestId("popover-O")).toBeVisible();

    await checkWaitListTimes(page, [7, 0, 4, 0, 2, 0, 0, 1, 0]);

    await page
      .getByTestId("region-2-section")
      .getByTestId("bloodType-O-button")
      .click();
    await expect(page.getByTestId("popover-O")).not.toBeVisible();

    await page
      .getByTestId("region-2-section")
      .getByTestId("bloodType-All-button")
      .click();
    await expect(page.getByTestId("popover-All")).toBeVisible();

    await checkWaitListTimes(page, [16, 1, 7, 2, 5, 0, 0, 1, 0]);

    await page
      .getByTestId("region-2-section")
      .getByTestId("bloodType-All-button")
      .click();
    await expect(page.getByTestId("popover-All")).not.toBeVisible();
  });
  test("Verify Transplant Analyis Messages", async ({ page }) => {
    await page.getByTestId(`report-date-2024-11-04`).click();
    await expect(page).toHaveURL(
      `${getBaseUrl()}/day/2024-11-04?waitListType=All+Types`
    );
    await expect(page.getByTestId(`page-heading`)).toHaveText("Day's Data");

    await expect(
      page.getByTestId(`region1_daily_smart_messages-0`)
    ).toBeVisible();
    await expect(page.getByTestId(`region1_daily_smart_messages-0`)).toHaveText(
      "💔 Patient Added To Waiting List 💔"
    );

    await expect(
      page.getByTestId(`region2_daily_smart_messages-0`)
    ).toBeVisible();
    await expect(page.getByTestId(`region2_daily_smart_messages-0`)).toHaveText(
      "O - 1B Patient might have been bumped to Status 1A"
    );
    await expect(
      page.getByTestId(`region2_daily_smart_messages-1`)
    ).toBeVisible();
    await expect(page.getByTestId(`region2_daily_smart_messages-1`)).toHaveText(
      "🎉 Patient Received Transplant 🎉"
    );

    await expect(
      page.getByTestId(`region3_daily_smart_messages-0`)
    ).not.toBeVisible();

    await expect(
      page.getByTestId(`region3_daily_smart_messages-0`)
    ).not.toBeVisible();

    await expect(
      page.getByTestId(`region5_daily_smart_messages-0`)
    ).toBeVisible();
    await expect(page.getByTestId(`region5_daily_smart_messages-0`)).toHaveText(
      "🎉 Patient Received Transplant 🎉"
    );

    await expect(
      page.getByTestId(`region6_daily_smart_messages-0`)
    ).not.toBeVisible();

    await expect(
      page.getByTestId(`region7_daily_smart_messages-0`)
    ).toBeVisible();
    await expect(page.getByTestId(`region7_daily_smart_messages-0`)).toHaveText(
      "A - 1B Patient might have been bumped to Status 1A"
    );
    await expect(
      page.getByTestId(`region7_daily_smart_messages-1`)
    ).toBeVisible();
    await expect(page.getByTestId(`region7_daily_smart_messages-1`)).toHaveText(
      "💔 Patient Added To Waiting List 💔"
    );

    await expect(
      page.getByTestId(`region8_daily_smart_messages-0`)
    ).toBeVisible();
    await expect(page.getByTestId(`region8_daily_smart_messages-0`)).toHaveText(
      "O - 1A Patient might have dropped to Status 7"
    );

    await expect(
      page.getByTestId(`region9_daily_smart_messages-0`)
    ).not.toBeVisible();

    await expect(
      page.getByTestId(`region10_daily_smart_messages-0`)
    ).not.toBeVisible();

    await expect(
      page.getByTestId(`region11_daily_smart_messages-0`)
    ).not.toBeVisible();
  });
  test("Verify Footer Elements", async ({ page }) => {
    // buy me a coffe
    await expect(page.getByTestId("buyMeCoffeeLink")).toBeVisible();
    await expect(page.getByTestId("buyMeCoffeeLink")).toHaveAttribute(
      "target",
      "_blank"
    );
    await expect(page.getByTestId("buyMeCoffeeLink")).toHaveAttribute(
      "href",
      "https://www.buymeacoffee.com/cap10chunks"
    );

    // email link
    await expect(page.getByTestId("emailMe")).toBeVisible();
    await expect(page.getByTestId("emailMe")).toHaveAttribute(
      "href",
      "mailto:djreale@gmail.com?subject=Pediatric Heart Transplant Site"
    );
  });
});
