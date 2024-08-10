require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const DB_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p6s9frw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
const districtRoutes = require("./routes/district-routes");
const app = express();
const HttpError = require("./models/http-error");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's domain
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

app.options("*", cors());

// body parser so we don't have to do it manually
app.use(bodyParser.json());

// // for CORS error
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

//   // Handle OPTIONS method
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

// requests for districts must START with /api/district, routes to to districtRoutes
app.use("/api/district", districtRoutes);

app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    console.log(err.message);
    res.status(403).json({ message: "CORS Error: Access denied" });
  } else {
    next(err);
  }
});

// only reached when a request doesn't get a response from any other middleware
app.use((req, res, next) => {
  console.log("couldn't find this route");
  const error = new HttpError("Couldn't find this route", 404);
  throw error;
});

// SPECIAL middleware function for ERRORS, if any middleware above send an error, this is called
app.use((error, req, res, next) => {
  // deletes image if error was encountered
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({
    message: error.message || "Error thrown in app.js. ERROR CODE: 2",
  });
});

// DB connection and server starting
mongoose
  .connect(DB_URL) // connects to DB using URL
  .then(() => {
    console.log("CONNECTED TO DATABASE");
    app.listen(process.env.PORT || 5000); // if connection is established, start server
  })
  .catch((error) => {
    console.log(error);
  });
