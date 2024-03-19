require("dotenv").config();
const path = require("path");
const { DateTime } = require("luxon");
const nodemailer = require("nodemailer");

// get report date
const lineByLine = require("n-readlines");
const liner = new lineByLine("LastReportDate.txt");

let line;
let lineNumber = 0;

let reportDate = "";

while ((line = liner.next())) {
  if (lineNumber === 0) {
    reportDate = line.toString();
  }
  lineNumber++;
}

const file = path.join(__dirname, "..", "ModifiedWaitingList.csv");
console.log(file);
const todaysDate = DateTime.now().toFormat("MM-dd-yyyy");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.EMAIL_FROM_ADDRESS,
  to: process.env.EMAIL_TO_ADDRESS,
  subject: `Transplant Waiting List ${todaysDate}`,
  text: `Transplant Waiting List Data through ${reportDate}`,
  attachments: [
    {
      filename: "TransplantWaitingList.csv",
      path: file,
    },
  ],
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Transplant Email sent: " + info.response);
  }
});
