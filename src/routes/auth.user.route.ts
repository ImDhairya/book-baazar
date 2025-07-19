import expreess from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.user.controller";
import { asyncHandler } from "../utils/async-handler";

const userRoutes = expreess.Router();

userRoutes.route("/login").post(loginController);
userRoutes.route("/register").post(registerController);
userRoutes.route("/logout").get(logoutController);
userRoutes.route("/forgetPassword/:id");
export default userRoutes;
