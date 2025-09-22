import express from "express";
import { userController } from "~/controllers/userController";
import { isAuthorized, isOwner } from "~/middlewares/authMiddleware.js";
import { userValidation } from "~/validations/userValidation";

const Router = express.Router();

// API đăng ký tài khoản.
Router.route("/register").post(
  userValidation.createNew,
  userController.register
);

// API đăng nhập.
Router.route("/login").post(userController.login);

// API đăng xuất.
Router.route("/logout").delete(userController.logout);

// API Refresh Token - Cấp lại Access Token mới.
Router.route("/refresh_token").put(userController.refreshToken);

// API lấy thông tin user hiện tại.
Router.route("/:id/me").get(
  isAuthorized,
  isOwner,
  userController.getCurrentUserInfo
);

export const userRoute = Router;
