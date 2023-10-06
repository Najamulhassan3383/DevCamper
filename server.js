const express = require("express");
const dotenv = require("dotenv");
//route files
const bootcamps = require("./routes/bootcamps");

// load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

// mount routers

app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT;

app.listen(
  PORT,
  console.log(
    `server running in   ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
