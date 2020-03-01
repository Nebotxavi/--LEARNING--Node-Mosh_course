const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function() {
  const db = config.get("db");
  //const db = "mongodb://localhost/genres_tests";

  mongoose.connect(db).then(() => winston.info(`Connected to ${db}`));
  // .catch(err => console.error("Could not connect to MongoDB: ", err));
  // CATCHER removed in order to use winston
};
