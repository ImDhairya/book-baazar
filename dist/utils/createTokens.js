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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenCreator = (cookiePayload, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (cookiePayload) {
        try {
            const accessToken = yield jsonwebtoken_1.default.sign(cookiePayload, process.env.ACCESS_SECRET, {
                expiresIn: "1d",
            });
            const refreshToken = yield jsonwebtoken_1.default.sign(cookiePayload, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 20, // 20 mins valid
            });
            // console.log(res.cookie, "TOKENS");
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV != "development",
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            });
            console.log(accessToken, "hi", refreshToken);
            // if (next) next();
            return { accessToken, refreshToken };
        }
        catch (error) {
            console.log("HIIHIHIHIHIHIHI", error);
        }
    }
});
exports.default = tokenCreator;
