import { successResponse } from "../utils/constants.js";
import { getVietnamDatetimeString } from "../utils/datetime.js";

export const responseFormatMiddleware = (req, res, next) => {
  const oldJson = res.json;
  res.json = function (data) {
    if (
      data &&
      typeof data === "object" &&
      ("success" in data || "error" in data)
    ) {
      return oldJson.call(this, data);
    }
    const response = successResponse(
      data,
      res.locals.message || "Success",
      getVietnamDatetimeString()
    );
    return oldJson.call(this, response);
  };
  next();
};

// Usage example:
// app.use(responseFormatMiddleware);
// app.get('/example', (req, res) => {
//   res.locals.message = "Dữ liệu lấy thành công";
//   res.status(StatusCodes.OK).json({ id: 1, name: "John Doe" });
// });
