import { myLogger } from "~/loggers/myLogger";
import { StatusCodes } from "http-status-codes";
import { jwtProvider } from "~/providers/JwtProvider.js";
import ApiError from "~/utils/ApiError.js";
import { env } from "~/config/environment";

// Middleware kiểm tra xác thực người dùng qua JWT Token
export const isAuthorized = async (req, res, next) => {
  try {
    // 1. Lấy token từ cookie hoặc header
    let accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      const authHeader = req.headers?.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.split(" ")[1];
      }
    }

    // 2. Nếu không có token, trả về lỗi
    if (!accessToken) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "No token provided!"));
    }

    // 3. Xác thực token
    const decoded = await jwtProvider.verifyToken(
      accessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    );

    // 4. Gắn thông tin user vào req
    req.user = decoded;

    // 5. Cho phép đi tiếp
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // 6.1 Nếu lỗi là do token hết hạn, trả về code thống nhất với Client để Client xử lý refresh token
      return next(
        new ApiError(
          StatusCodes.FORBIDDEN,
          "Token expired! You need to refresh token."
        )
      );
    } else if (
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      // 6.2 Nếu xảy ra các lỗi khác liên quan đến Token
      return next(
        new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Invalid token! Please login again."
        )
      );
    } else {
      // 6.3 Các lỗi khác
      myLogger.error(error.message, { stack: error.stack });
      return next(
        new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error")
      );
    }
  }
};

// Middleware kiểm tra quyền sở hữu tài nguyên (user chỉ được phép thao tác trên chính tài nguyên của mình)
export const isOwner = (req, res, next) => {
  try {
    // Đảm bảo đã xác thực và có req.user
    if (!req.user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Not authenticated!"));
    }

    // Lấy userId từ token và từ request (ưu tiên params, sau đó body)
    const userIdFromToken = req.user.id || req.user._id;
    const userIdFromRequest = req.params.id || req.body.userId || req.body._id;

    myLogger.debug(
      `isOwner check: ${userIdFromToken} === ${userIdFromRequest}`
    );

    myLogger.debug(
      `UserId from token: ${userIdFromToken}, UserId from request: ${userIdFromRequest}`
    );

    // So sánh, nếu không trùng thì cấm truy cập
    if (userIdFromToken !== userIdFromRequest) {
      return next(new ApiError(StatusCodes.FORBIDDEN, "Permission denied!"));
    }

    // Cho phép đi tiếp
    next();
  } catch (error) {
    myLogger.error(error.message, { stack: error.stack });
    return next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error")
    );
  }
};

// Middleware kiểm tra quyền admin
export const isAdmin = (req, res, next) => {
  try {
    // Đảm bảo đã xác thực và có req.user
    if (!req.user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Not authenticated!"));
    }
    // Kiểm tra role
    if (req.user.role !== "admin") {
      return next(new ApiError(StatusCodes.FORBIDDEN, "Permission denied!"));
    }
    // Cho phép đi tiếp
    next();
  } catch (error) {
    myLogger.error(error.message, { stack: error.stack });
    return next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error")
    );
  }
};

/**
 * Usage example:
 * Router.route("/:userId/profile").get(isAuthenticated, isOwner, userController.getProfile);
 * Router.route("/admin").get(isAuthenticated, isAdmin, adminController.getAdminData);
 */
