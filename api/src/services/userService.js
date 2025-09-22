import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { jwtProvider } from "~/providers/JwtProvider.js";
import { env } from "~/config/environment";
import { JWT_LIFE } from "~/utils/constants.js";
import { userModel } from "~/models/userModel.js";
import { myLogger } from "~/loggers/myLogger";
import bcrypt from "bcryptjs";

const login = async (email, password) => {
  let user = await userModel.getUserByEmail(email);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  user = user.toObject();

  // So sánh password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  delete user.password;
  delete user.addresses;

  // Tạo thông tin Payload để  trong JWT Token
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };
  // Tạo Access Token
  const accessToken = await jwtProvider.generateToken(
    payload,
    env.ACCESS_TOKEN_SECRET_SIGNATURE,
    JWT_LIFE.ACCESS_TOKEN_LIFE
  );
  // Tạo Refresh Token
  const refreshToken = await jwtProvider.generateToken(
    payload,
    env.REFRESH_TOKEN_SECRET_SIGNATURE,
    JWT_LIFE.REFRESH_TOKEN_LIFE
  );

  // Trả về thông tin user, accessToken, refreshToken cho Controller
  return { user, accessToken, refreshToken };
};

const refreshToken = async (refreshToken) => {
  try {
    // Xác thực token
    const decoded = await jwtProvider.verifyToken(
      refreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    );

    // Tạo payload mới cho Access Token
    delete decoded.iat;
    delete decoded.exp;
    const user = decoded;

    // Tạo Access Token
    const accessToken = await jwtProvider.generateToken(
      user,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      JWT_LIFE.ACCESS_TOKEN_LIFE
    );

    return { accessToken };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Nếu lỗi là do token hết hạn
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Refresh token expired! Please login again."
      );
    } else if (
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      // Nếu xảy ra các lỗi khác liên quan đến Token
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Invalid refresh token! Please login again."
      );
    } else {
      // Các lỗi khác
      throw error;
    }
  }
};

const getCurrentUserInfo = async (userId) => {
  const user = await userModel.getUserById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  delete user.password;
  return user;
};

const register = async (userData) => {
  try {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    let newUser = await userModel.createUser(userData);
    newUser = newUser.toObject();
    delete newUser.password;

    return newUser;
  } catch (error) {
    // Email đã tồn tại
    if (error.code === 11000 && error.keyPattern.email) {
      throw new ApiError(StatusCodes.CONFLICT, "Email already exists");
    }
    // Dữ liệu bị lỗi do quá trình xử lý của server
    myLogger.error(error.message, { stack: error.stack });
    if (error.name === "ValidationError") {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Data was corrupted during server processing."
      );
    }
    throw error;
  }
};

export const userService = {
  login,
  getCurrentUserInfo,
  register,
  refreshToken,
};
