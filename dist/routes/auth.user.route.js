"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_user_controller_1 = require("../controllers/auth.user.controller");
const userRoutes = express_1.default.Router();
userRoutes.route("/login").post(auth_user_controller_1.loginController);
userRoutes.route("/register").post(auth_user_controller_1.registerController);
userRoutes.route("/logout").get(auth_user_controller_1.logoutController);
userRoutes.route("/forgetPassword/:id");
exports.default = userRoutes;
