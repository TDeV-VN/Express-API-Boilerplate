/* eslint-disable max-len */
// Email hợp lệ theo chuẩn RFC 5322
const email =
  /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"[^\r\n"]*")@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

// Mật khẩu tối thiểu tám ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt
const password =
  // eslint-disable-next-line no-useless-escape
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:'",.<>/?~\\])[A-Za-z\d!@#$%^&*()_+\-=\[\]{}|;:'",.<>/?~\\]{8,}$/;

// Tên người dùng chỉ chứa chữ cái và khoảng trắng, tối thiểu 2 ký tự và tối đa 50 ký tự
const fullName = /^[a-zA-Z\s]{2,50}$/;

// Số điện thoại Việt Nam, bắt đầu bằng số 0, theo sau là 9 hoặc 10 chữ số
const phoneVN = /^0\d{9,10}$/;

export const validate = {
  email,
  password,
  fullName,
  phoneVN,
};
