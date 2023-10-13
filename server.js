const express = require("express");
const dotenv = require("dotenv");
//route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const errorHanlder = require("./middleware/error");
const fileupload = require("express-fileupload");
const path = require("path");
//mongo db connection

const db = require("./config/db");
const colors = require("colors");
// load env vars
dotenv.config({ path: "./config/config.env" });

// const logger = require("./middleware/logger");
const morgan = require("morgan");
const connectDB = require("./config/db");
// console.log(process.env.MONG_URI);
connectDB();
const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//file uploading
app.use(fileupload());

//set static folder
app.use(express.static(path.join(__dirname, "public")));

// app.use(logger);
// mount routers

app.use("/api/v1/courses", courses);
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/auth", auth);
app.use(errorHanlder);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(
    `server running in   ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

//handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  //close server and exit process
  server.close(() => process.exit(1));
});
