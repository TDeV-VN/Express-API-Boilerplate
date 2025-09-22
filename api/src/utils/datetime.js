export function getVietnamDatetimeString(date = new Date()) {
  return date.toLocaleString("vi-VN", {
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  });
}
