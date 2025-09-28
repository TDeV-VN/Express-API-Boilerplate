import { StatusCodes } from "http-status-codes";
import ms from "ms";
import ApiError from "~/utils/ApiError.js";
import { JWT_LIFE } from "~/utils/constants.js";
import { userService } from "~/services/userService.js";

const getCurrentUserInfo = async (req, res, next) => {
  try {
    const user = await userService.getCurrentUserInfo(req.user._id);

    res.locals.message = "Get current user info success!";
    res.locals.data = user;
    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await userService.login(
      email,
      password
    );

    // Trả về http only cookie cho Client
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Không cho phép client (JS) truy cập vào cookie
      secure: true, // Nếu true thì chỉ gửi cookie qua kết nối HTTPS
      sameSite: "none", // Cấu hình cookie trong các trình duyệt hiện đại
      maxAge: ms(JWT_LIFE.COOKIE_LIFE), // Thời gian sống của cookie
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms(JWT_LIFE.COOKIE_LIFE),
    });

    // Trả về thông tin user và token cho Client
    res.locals.message = "Login API success!";
    res.status(StatusCodes.OK).json({
      ...user,
      accessToken,
      refreshToken,
      accessTokenExpiresIn: ms(JWT_LIFE.ACCESS_TOKEN_LIFE),
      refreshTokenExpiresIn: ms(JWT_LIFE.REFRESH_TOKEN_LIFE),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      // Chống enumeration attack
      if (
        error.statusCode === StatusCodes.NOT_FOUND ||
        error.statusCode === StatusCodes.UNAUTHORIZED
      ) {
        error.statusCode = StatusCodes.UNAUTHORIZED;
        error.message = "Invalid credentials";
      }
    }
    return next(error);
  }
};

const logout = (req, res) => {
  // Xoá cookie ở phía Client
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.locals.message =
    "Cookies cleared successfully! Please delete token in client storage to logout completely!";
  res.status(StatusCodes.OK).json({});
};

const refreshToken = async (req, res, next) => {
  try {
    // 1. Lấy token từ cookie hoặc body
    let refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      refreshToken = req.body?.refreshToken;
    }

    // 2. Nếu không có token, trả về lỗi
    if (!refreshToken) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "No refresh token provided!"
      );
    }

    // 3. Gọi service để refresh token
    const { accessToken } = await userService.refreshToken(refreshToken);

    // 6. Trả về http only cookie cho Client
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Không cho phép client (JS) truy cập vào cookie
      secure: true, // Nếu true thì chỉ gửi cookie qua kết nối HTTPS
      sameSite: "none", // Cấu hình cookie trong các trình duyệt hiện đại
      maxAge: ms(JWT_LIFE.COOKIE_LIFE), // Thời gian sống của cookie
    });

    // Trả về thông tin user và token cho Client
    res.locals.message = "Refresh token success!";
    res.locals.data = { accessToken, refreshToken };
    res.status(StatusCodes.OK).json({
      ...req.user,
      accessToken,
      accessTokenExpiresIn: ms(JWT_LIFE.ACCESS_TOKEN_LIFE),
    });
  } catch (error) {
    return next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await userService.register(userData);

    res.locals.message = "User registered successfully!";
    res.locals.data = newUser;
    return res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    return next(error);
  }
};

export const userController = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUserInfo,
};
