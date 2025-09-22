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

module.exports = Router;
