const express = require("express");
const path = require("path");
// const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
let cors = require("cors");
const PORT = 5000;

const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// route users är headless - renderas på front
app.use("/api/users", usersRouter);
//route admin är monolit - renderas i admin
app.use("/admin", adminRouter);

async function init() {
  try {
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    await mongoose.connect("mongodb://localhost:27017/newsletter", options);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
  app.listen(PORT, () =>
    console.log(`Server is up and running on port: ${PORT}`)
  );
}

init();

module.exports = app;
