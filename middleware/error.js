const winston = require("winston");
const { transports, createLogger, format } = require("winston");

module.exports = function(err, req, res, next) {
  winston.error(err.message, { metadata: { metaKey: err } }); // this will provide more details than the next option
  //winston.log("error", err.message);

  // const logger = createLogger({
  //   format: format.combine(format.timestamp(), format.json()),
  //   transports: [
  //     new transports.File({ filename: "logfile.log", level: "error" })
  //   ]
  // });
  // logger.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  res.status(500).send("Something went wrong...");
};
