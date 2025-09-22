const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
import APIs_v1 from "./routes/v1/index.js";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
import { responseFormatMiddleware } from "./middlewares/responseFormatMiddleware.js";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import { setRequestId } from "./middlewares/requestIdMiddleware.js";
import ApiError from "./utils/ApiError.js";

const app = express();
app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(setRequestId);
app.use(responseFormatMiddleware);
app.use("/v1", APIs_v1);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new ApiError(404, "Not Found"));
});

app.use(errorHandlingMiddleware);

module.exports = app;
