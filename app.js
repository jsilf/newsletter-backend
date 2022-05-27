const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
let cors = require("cors");

const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");

let app = express();

require("dotenv").config();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", usersRouter);
app.use("/admin", adminRouter);

const uri = process.env.ATLAS_URI;

// const uri = "mongodb://localhost:27017/newsletter";

async function init() {
  try {
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    await mongoose.connect(uri, options);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
}

init();

module.exports = app;
