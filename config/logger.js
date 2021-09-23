const winston = require("winston");

// Set date to local
const timezoned = () => {
  return new Date().toLocaleString();
};

const logger = winston.createLogger({
  transports: [
    // Write all logs with level `error` and below it to `errors.log`
    new winston.transports.File({
      level: "error",
      filename: "errors.log",
      datePattern: "YYYY-MM-DD-HH",
      format: winston.format.combine(
        winston.format.timestamp({ format: timezoned }),
        winston.format.json()
      ),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
