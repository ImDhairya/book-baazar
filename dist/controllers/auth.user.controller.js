"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.registerController = exports.loginController = void 0;
const async_handler_1 = require("../utils/async-handler");
const api_errors_1 = require("../utils/api-errors");
const validator_1 = require("../validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../libs/db");
const api_response_1 = require("../utils/api-response");
exports.loginController = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new api_errors_1.ApiError(401, "User credentials are requred");
    }
    const validationResult = validator_1.LoginUserValidation.safeParse({ email, password });
    if (!validationResult.success) {
        throw new api_errors_1.ApiError(400, "Validation failed", validationResult.error.issues);
    }
    const user = yield db_1.db.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!user) {
        throw new api_errors_1.ApiError(401, "User does not exists.");
    }
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new api_errors_1.ApiError(401, "The user credentials do not match please try again.");
    }
    const cookiePayload = {
        id: user.id,
    };
    // bcrypt.compare()
    const cookieData = yield jsonwebtoken_1.default.sign(cookiePayload, process.env.JWT_SECRET);
    res.cookie("JWT", cookieData, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV != "development",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    const responseData = {
        id: user.id,
        name: user.name,
        userName: user.userName,
    };
    const apiResponse = new api_response_1.ApiResponse(200, responseData, "userLoggedIn successfully.");
    return res.status(apiResponse.statusCode).json(apiResponse);
    // return res.status(200).json({
    //   success: true,
    //   message: "Logged in successfully.",
    //   existingUser: {
    //     id: user.id,
    //     email: user.email,
    //     name: user.name,
    //   },
    // });
}));
exports.registerController = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password, name } = req.body;
    if (!userName || !email || !password || !name) {
        throw new api_errors_1.ApiError(401, "The required details are not found.");
    }
    const validator = validator_1.RegisterUser.safeParse({ userName, email, password, name });
    if (!validator.success) {
        throw new api_errors_1.ApiError(401, "The validation for data failed.", validator.error.issues);
    }
    const existingUser = yield db_1.db.user.findUnique({
        where: {
            email: email,
            userName: userName,
        },
    });
    if (existingUser)
        throw new api_errors_1.ApiError(401, "The user already exists please login.");
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = yield db_1.db.user.create({
        data: {
            name: name,
            email: email,
            userName: userName,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            userName: true,
        },
    });
    const jwtPayload = {
        id: user.id,
        name: user.name,
    };
    const token = yield jsonwebtoken_1.default.sign(jwtPayload, process.env.JWTSECRET, {
        expiresIn: "7d",
    });
    // res.cookie("jwt", token, {
    //     httpOnly: true,
    //     sameSite: "strict",
    //     secure: process.env.NODE_ENV != "development",
    //     maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    //   });
    // const responseData = [user.id, user.name, user.userName];
    // return new ApiResponse(200, responseData, "User Registered Successfully!");
    const responseData = [user.id, user.name, user.userName];
    const apiResponse = new api_response_1.ApiResponse(200, responseData, "User Registered successfully.");
    return res.status(apiResponse.statusCode).json(apiResponse);
}));
exports.logoutController = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    console.log(token);
    if (!token) {
        throw new api_errors_1.ApiError(401, "Unable to find cookies ");
    }
    res.cookie("jwt", "", {
        expires: new Date(),
    });
    const apiResponse = new api_response_1.ApiResponse(201, null, "Logged out successfully");
    return res.status(apiResponse.statusCode).json(apiResponse);
}));
