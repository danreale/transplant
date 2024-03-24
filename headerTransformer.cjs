const lineByLine = require("n-readlines");
const liner = new lineByLine("ModifiedWaitingList.csv");
const fs = require("fs");
const path = require("path");
const { cwd } = require("process");

let line;
let lineNumber = 0;

const fileContents = [];

while ((line = liner.next())) {
  if (lineNumber === 0) {
    const str = `region,blood_type,empty,all_types,heart_status_1A,heart_status_1B,heart_status_2,heart_status_7_inactive`;
    fileContents.push(str);
  } else {
    const liney = line.toString();
    fileContents.push(liney);
  }
  lineNumber++;
}

console.log("end of file reached");
console.log(fileContents.join("\n"));

const file = path.join(cwd(), "TransformedWaitingListHeader.csv");
console.log(file);

fs.writeFile(file, fileContents.join("\n"), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Created new file successfully");
  }
});
