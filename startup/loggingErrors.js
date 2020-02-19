const winston = require("winston");
require("winston-mongodb");
// require("express-async-errors");

module.exports = function() {
  winston.add(
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );
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
};
