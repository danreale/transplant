import { test, expect } from "@playwright/test";

test.describe("End To End Tests", () => {
  test("Today Page", async () => {
    // go to todays page
    // verify date format for todays date
    // change each wait list status and make sure the data is loaded and lable is updated
    // make sure the data refresh dates text is showing
    // make sure the region text is showing
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
