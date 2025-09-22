import { errorResponse } from "../utils/constants.js";
import { getVietnamDatetimeString } from "../utils/datetime.js";
import { env } from "~/config/environment";
import { StatusCodes } from "http-status-codes";
import { myLogger } from "~/loggers/myLogger.js";
import ApiError from "~/utils/ApiError.js";

// eslint-disable-next-line no-unused-vars
export const errorHandlingMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  // Các lỗi hệ thống mà dev chưa lường trước được
  if (!(err instanceof ApiError)) {
    myLogger.error(err.message, { stack: err.stack });
    err = new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal server error"
    );
  }

  const response = errorResponse(
    err,
    err.message || StatusCodes[err.statusCode],
    getVietnamDatetimeString(),
    env.BUILD_MODE
  );
  if (env.BUILD_MODE !== "dev") delete response.error.stack;

  res.status(err.statusCode).json(response);
};

/**
 * Usage example (in controller):
 * try {
 *    // Your code here
 * } catch (error) {
 *    return next(error); // Gọi next với đối số là error để chuyển đến middleware xử lý lỗi
 * }
 */
