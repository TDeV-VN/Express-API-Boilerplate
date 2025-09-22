export const successResponse = (data, message = "Success", timestamp) => ({
  success: true,
  message,
  data,
  error: null,
  timestamp,
});

export const errorResponse = (err, message, timestamp, env = "dev") => ({
  success: false,
  message,
  data: null,
  error: {
    statusCode: err.statusCode,
    stack: env === "dev" ? err.stack : undefined,
  },
  timestamp,
});

export const WHITELIST_DOMAINS = [
  "http://localhost:3000",
  // Các domain được phép truy cập API của chúng ta
];

export const ROLE = ["customer", "admin"];

const ACCESS_TOKEN_LIFE = "1 days";
const REFRESH_TOKEN_LIFE = "7 days";
const COOKIE_LIFE = "7 days";
export const JWT_LIFE = {
  ACCESS_TOKEN_LIFE,
  REFRESH_TOKEN_LIFE,
  COOKIE_LIFE,
};
