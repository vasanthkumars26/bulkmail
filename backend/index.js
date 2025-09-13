require('dotenv').config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB using env variable
mongoose.connect(process.env.DB_URI)
.then(() => console.log("DB CONNECTED.."))
.catch(() => console.log("FAILED CONNECT DB.."));

// Model
const credentials = mongoose.model("credentials", {}, "bulkmail");

// POST route
app.post("/sendemail", (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  const msg = req.body.msg;
  const email = req.body.email;

  credentials.find().then((data) => {
    if (!data[0]) return res.send(false);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // read from env
        pass: process.env.EMAIL_PASS,
      },
    });

    new Promise(async (resolve, reject) => {
      try {
        for (var i = 0; i < email.length; i++) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email[i],
            subject: "A message from Vasanth's Bulkmail app",
            text: msg,
          });
          console.log("Email sent to " + email[i]);
        }
        resolve("Successfull!");
      } catch (error) {
        reject("Failed..");
      }
    })
      .then(() => res.send(true))
      .catch(() => res.send(false));
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Started on port ${PORT}..`));
