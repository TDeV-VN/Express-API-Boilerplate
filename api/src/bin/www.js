#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("../app.js");
var debug = require("debug")("gear-up:server");
var http = require("http");
import { CONNECT_DB } from "../config/mongodb.js";
import { env } from "../config/environment.js";
import { myLogger } from "../loggers/myLogger.js";

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(env.APP_PORT || "3000");
app.set("port", port);

let server;
const START_SERVER = () => {
  // Create HTTP server.
  server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);
};

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      myLogger.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      myLogger.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var host = addr.address === "::" ? "localhost" : addr.address;
  var port = addr.port;
  myLogger.info(`Server is running on http://${host}:${port}`);
}

// Chỉ khi nào kết nối DB thành công thì mới khởi động server
(async () => {
  try {
    myLogger.info("1. Connecting to MongoDB...");
    await CONNECT_DB();
    myLogger.info("2. Connected to MongoDB");
    myLogger.info("3. Starting server...");
    START_SERVER();
  } catch (error) {
    myLogger.error(error);
    process.exit(1);
  }
})();
