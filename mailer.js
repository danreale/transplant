const dotenv = require("dotenv");
const path = require("path");
const { DateTime } = require("luxon");
dotenv.config();
const nodemailer = require("nodemailer");

const file = path.join(__dirname, "ModifiedWaitingList.csv");
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
  text: "Transplant Waiting List",
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
