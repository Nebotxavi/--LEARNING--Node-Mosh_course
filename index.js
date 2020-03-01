const express = require("express");
const winston = require("winston");
const app = express();

require("./startup/configSettings")();
require("./startup/dbConnection")();
require("./startup/routes")(app);
require("./startup/loggingErrors")();
require("./startup/validation")();

// throw new Error("ERROR AT INDEX.JS created on purpose");

// const p = Promise.reject(new Error("FAIL, promise rejection"));
// p.then(() => console.log("done"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}`)
);

module.exports = server;
