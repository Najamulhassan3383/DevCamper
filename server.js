const express = require("express");
const dotenv = require("dotenv");
//route files
const bootcamps = require("./routes/bootcamps");
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

// app.use(logger);
// mount routers

app.use("/api/v1/bootcamps", bootcamps);

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
