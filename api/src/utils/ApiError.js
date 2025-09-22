class ApiError extends Error {
  constructor(statusCode, message) {
    // Nếu chỉ truyền message, statusCode sẽ là undefined hoặc chuỗi
    if (typeof statusCode !== "number") {
      message = statusCode; // statusCode thực ra là message
      statusCode = 500; // mặc định là 500
    }

    super(message);

    // Tên của cái custom Error này, nếu không set thì mặc định nó sẽ kế thừa là "Error"
    this.name = "ApiError";

    // Gán thêm http status code của chúng ta ở đây
    this.statusCode = statusCode;

    // Ghi lại Stack Trace (dấu vết ngăn xếp) để thuận tiện cho việc debug
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;

// Usage example:
// import ApiError from "~/utils/ApiError.js";

/*
  try {
    ...some code
    throw new ApiError(StatusCodes.BAD_REQUEST, "Your custom error message");
  }
  catch (error) {
    next(error); // this error is already an instance of ApiError
  }
*/

/*
  try {
    ...some code
    // Error throw by system, package, or third-party library
  }
  catch (error) {
    // Convert to ApiError
    next(new ApiError(error.statusCode, error.message));
  }
}*/
