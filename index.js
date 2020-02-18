const config = require("config");
const dbDebugger = require("debug")("app:db");
const error = require("./middleware/error");
// require("express-async-errors");
const express = require("express");
const helmet = require("helmet");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const winston = require("winston");
require("winston-mongodb");
const auth = require("./routes/auth");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const users = require("./routes/users");
const rentals = require("./routes/rentals");

const app = express();
require("./startup/routes")(app);

winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost/genres"
  })
);

process.on("uncaughtException", ex => {
  console.log("UNCAUGHT EX", ex);
  // winston.error(ex.message, ex); MORE DETAILS IF LOG IN FILE
  winston.error(ex.message, { metadata: { metaKey: ex } }); // MORE DETAILS IF MONGO
  // process.exit(1); THIS WOULD PREVENT WINSTON TO DO ITS JOB
});

process.on("unhandledRejection", ex => {
  console.log("UNCAUGHT REJECTION (ASYNC) EX", ex);
  // winston.error(ex.message, ex)
  winston.error(ex.message, { metadata: { metaKey: ex } });
  // process.exit(1);
});

// throw new Error("ERROR AT INDEX.JS created on purpose");

// const p = Promise.reject(new Error("FAIL, promise rejection"));
// p.then(() => console.log("done"));

mongoose
  .connect("mongodb://localhost/genres")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB: ", err));

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled...");
}

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
