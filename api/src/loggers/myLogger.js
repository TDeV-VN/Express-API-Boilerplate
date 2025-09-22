const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
import { asyncLocalStorage } from "../middlewares/requestIdMiddleware.js";
import { env } from "../config/environment.js";

// Format text (console, dev mode)
const logFormat = format.printf(({ level, message, timestamp, stack }) => {
  const store = asyncLocalStorage.getStore();
  const requestId = store?.get("requestId") || "-";
  return stack
    ? `${requestId} ${timestamp} [${level.toUpperCase()}]: ${message} - ${stack}`
    : `${requestId} ${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Format JSON (file, prod mode)
const jsonFormat = format.combine(
  format.timestamp(),
  format.printf(({ level, message, timestamp, stack }) => {
    const store = asyncLocalStorage.getStore();
    const requestId = store?.get("requestId") || "-";

    return JSON.stringify({
      timestamp,
      level,
      requestId,
      message,
      stack: stack || undefined,
    });
  })
);

class MyLogger {
  constructor() {
    // Ghi file info
    const dailyRotateFileTransportInfo = new transports.DailyRotateFile({
      filename: "application-%DATE%.info.log",
      datePattern: "YYYY-MM-DD",
      dirname: "logs",
      maxFiles: "14d",
      zippedArchive: false,
      level: "info",
      format: jsonFormat,
    });

    // Ghi file error
    const dailyRotateFileTransportError = new transports.DailyRotateFile({
      filename: "application-%DATE%.error.log",
      datePattern: "YYYY-MM-DD",
      dirname: "logs",
      maxFiles: "14d",
      zippedArchive: false,
      level: "error",
      format: jsonFormat,
    });

    const transportsArr = [
      dailyRotateFileTransportInfo,
      dailyRotateFileTransportError,
    ];

    // Chỉ log ra console ở môi trường dev
    if (env.BUILD_MODE === "dev") {
      transportsArr.push(
        new transports.Console({
          level: "debug",
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            logFormat,
            format.colorize({ all: true })
          ),
        })
      );
    }

    this.logger = createLogger({
      level: env.BUILD_MODE === "dev" ? "debug" : "info",
      transports: transportsArr,
      exitOnError: false,
    });
  }
}

exports.myLogger = new MyLogger().logger;

// Usage example:
// import { myLogger } from "../loggers/mylogger.log.js";
// myLogger.info('This is an info message');
// myLogger.error('This is an error message with stack trace', new Error('Sample error'));
// myLogger.debug('This is a debug message');
