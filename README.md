### Express API Boiler place

---

## CẢNH BÁO

Cấu trúc phản hồi của API ở môi trường **Development** và môi trường **Production** là khác nhau (có / không bao gồm stack trace trong error response).

---

## BẮT ĐẦU VỚI (./api)

- Tạo tệp bí mật `.env` trong thư mục `./api/secrets`, bổ sung các biến môi trường dựa theo tệp `.env.example`.

- `npm install`

---

## KHỞI CHẠY API (./api)

### Môi trường Development

- **Khởi chạy với npm:** `npm run dev`

### Môi trường Production

- **Khởi chạy với npm:** `npm run production`

---

## Mẫu này đã bao gồm các cấu hình

- Hot reload khi chạy ở môi trường dev.
- Code convention rules.
- Chuẩn hóa API Response.
- Global error & exception handler.
- Logger (console & file).
- Kết nối MongoDB sử dụng Mongoose.

---

## QUY CHUẨN MÃ NGUỒN API (CODE CONVENTION)

- API sử dụng gói **ESLint** để thiết lập các nguyên tắc cho cú pháp mã nguồn.
- Nên sử dụng **Visual Studio Code** kết hợp với **ESLint extension** để trực quan hóa và phát hiện sớm các đoạn mã vi phạm quy chuẩn.
- Các quy chuẩn được định nghĩa trong tệp `eslint.config.mjs`.
- Kiểm tra các vi phạm bằng cách thủ công: `npm run lint`

### CÁCH BỎ QUA MỘT QUY TẮC

Bạn có thể sử dụng các chỉ dẫn sau để bỏ qua một quy tắc khi cần thiết:

```javascript
// Bỏ qua một dòng cụ thể
const express = require("express"); // eslint-disable-line no-var

// Bỏ qua dòng tiếp theo
// eslint-disable-next-line no-console
console.log("Server started");

// Bỏ qua một khối mã
/* eslint-disable no-console */
console.log("debug");
console.log("another log");
/* eslint-enable no-console */
```
