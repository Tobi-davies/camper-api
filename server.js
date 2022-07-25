const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
// const logger = require("./middleware/logger");
const connectDB = require("./config/db");

//LOAD ENV
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

//Route files
const bootcamps = require("./routes/bootcamps");

const app = express();

//Body parser

// app.use(logger);

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //close server and exit process
  server.close(() => process.exit(1));
});
