const express = require("express");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");


//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookies and file middleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//temp check
app.set("view engine", "ejs");



//import all routes here
const staff = require("./routes/staff");


//router middleware
app.use("/api/v1", staff);


app.get("/", (req, res) => {
  res.render("home");
});


// export app js
module.exports = app;
