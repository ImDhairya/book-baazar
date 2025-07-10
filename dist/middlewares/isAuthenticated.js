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
exports.isAuthenticated = void 0;
const api_errors_1 = require("../utils/api-errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { jwtToken } = req.cookies;
    if (!jwtToken) {
        throw new api_errors_1.ApiError(501, "User authentication failed");
    }
    const decode = yield jsonwebtoken_1.default.verify(jwtToken, process.env.JWT_SECRET);
    if (decode) {
        res.user = decode;
        next();
    }
    else {
        throw new api_errors_1.ApiError(501, "User not authenticated to this route.");
    }
});
exports.isAuthenticated = isAuthenticated;
