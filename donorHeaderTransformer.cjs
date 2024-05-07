const lineByLine = require("n-readlines");
const liner = new lineByLine("DonorList.csv");
const fs = require("fs");
const path = require("path");
const { cwd } = require("process");

let line;
let lineNumber = 0;

const fileContents = [];

while ((line = liner.next())) {
  if (lineNumber === 0) {
    const str = `gender,ethnicity,,All ABO,blood_type_o,A,blood_type_b,AB`;
    fileContents.push(str);
  } else {
    const liney = line.toString();
    fileContents.push(liney);
  }
  lineNumber++;
}

console.log("end of file reached");
console.log(fileContents.join("\n"));

const file = path.join(cwd(), "TransformedDonorListHeader.csv");
console.log(file);

fs.writeFile(file, fileContents.join("\n"), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Created new file successfully");
  }
});
