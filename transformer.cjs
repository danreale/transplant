const csv = require("csvtojson");
const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");

const todaysDate = DateTime.now()
  .setZone("America/New_York")
  .toFormat("yyyy-MM-dd");
// const formattedDate = DateTime.fromFormat(todaysDate, "yyyy-MM-dd");
console.log(todaysDate);

async function transplantData() {
  const jsonArray = await csv().fromFile("TransformedWaitingListHeader.csv");
  //   console.log(jsonArray);

  const transformedData = [];
  let region = "";
  for (let index = 0; index < jsonArray.length; index++) {
    const element = jsonArray[index];
    // console.log(region);
    if (element.region !== "") {
      // if has a region, set the region
      region = element.region;
      //   console.log(element);
      element.all_types = parseInt(element.all_types);
      element.heart_status_1A = parseInt(element.heart_status_1A);
      element.heart_status_1B = parseInt(element.heart_status_1B);
      element.heart_status_2 = parseInt(element.heart_status_2);
      element.heart_status_7_inactive = parseInt(
        element.heart_status_7_inactive
      );
      element.report_date = todaysDate;
      transformedData.push(element);
    } else {
      // if no region, then take the set region
      element.region = region;
      element.all_types = parseInt(element.all_types);
      element.heart_status_1A = parseInt(element.heart_status_1A);
      element.heart_status_1B = parseInt(element.heart_status_1B);
      element.heart_status_2 = parseInt(element.heart_status_2);
      element.heart_status_7_inactive = parseInt(
        element.heart_status_7_inactive
      );
      element.report_date = todaysDate;

      transformedData.push(element);
    }
  }
  // console.log(transformedData);
  const file = path.join(__dirname, "..", "DatabaseWaitingList.json");
  console.log(file);

  fs.writeFile(file, JSON.stringify(transformedData, null, 2), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Created new file successfully");
    }
  });
}

transplantData();
