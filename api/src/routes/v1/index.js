import express from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError.js";
import { userRoute } from "./userRoute";

const Router = express.Router();

Router.get("/health", function (req, res) {
  res.locals.message = "APIs V1 is healthy";
  res.status(StatusCodes.ACCEPTED).json({ apiVersion: "v1", status: "OK" });
});

Router.get("/error-simulation", function (req, res, next) {
  next(new ApiError(StatusCodes.ACCEPTED, "This is a simulated error"));
});

Router.use("/users", userRoute);

/* For test TODO-Tree */

// NOTE: This is a note tag
// WARN: This is a warning tag
// HACK: This is a hack tag
// REVIEW: This is a review tag
// TODO: this is a todo tag
// FIXME: this is a fixme tag

module.exports = Router;
