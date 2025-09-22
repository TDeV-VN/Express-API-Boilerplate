import { AsyncLocalStorage } from "async_hooks";
import { v4 as uuidv4 } from "uuid";

export const asyncLocalStorage = new AsyncLocalStorage();
export const setRequestId = (req, res, next) => {
  const requestId = req.headers["x-request-id"] || uuidv4();

  // Gắn vào response để client thấy
  res.setHeader("X-Request-Id", requestId);

  // Tạo context lưu trữ requestId
  asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set("requestId", requestId);
    next();
  });
};
