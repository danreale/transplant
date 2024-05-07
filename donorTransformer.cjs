const csv = require("csvtojson");
const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");
const { cwd } = require("process");

const todaysDate = DateTime.now()
  .setZone("America/New_York")
  .toFormat("yyyy-MM-dd");
// const formattedDate = DateTime.fromFormat(todaysDate, "yyyy-MM-dd");
console.log(todaysDate);

async function transplantData() {
  const jsonArray = await csv().fromFile("TransformedDonorListHeader.csv");
  //   console.log(jsonArray);

  const transformedData = [];
  let gender = "";
  for (let index = 8; index < jsonArray.length; index++) {
    const element = jsonArray[index];
    // console.log(region);
    if (element.gender !== "") {
      // if has a region, set the region
      gender = element.gender;
    } else {
      element.gender = gender;
    }
    element.blood_type_o = parseInt(element.blood_type_o);
    element.blood_type_b = parseInt(element.blood_type_b);

    delete element.A;
    delete element.AB;
    delete element["All ABO"];
    delete element.field3;

    element.report_date = todaysDate;
    transformedData.push(element);
  }
  // console.log(transformedData);
  const file = path.join(cwd(), "DatabaseDonorList.json");
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
