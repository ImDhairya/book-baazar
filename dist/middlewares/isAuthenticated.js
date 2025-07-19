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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createTokens_1 = __importDefault(require("../utils/createTokens"));
const api_errors_1 = require("../utils/api-errors");
const db_1 = require("../libs/db");
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken, accessToken } = req.cookies;
    try {
        if (accessToken) {
            const decodedData = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_SECRET);
            req.user = decodedData;
            return next();
        }
        else {
            console.log("Access token not there.");
        }
    }
    catch (error) {
        // access token is not present
        console.log(error, "The access token is not present");
    }
    if (refreshToken) {
        console.log("Refreshtoken", refreshToken);
        try {
            const decodeRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
            // query to the db for the user and check both existing user and the db for the user is working or not.
            const existingUser = yield db_1.db.user.findUnique({
                where: {
                    id: decodeRefreshToken.id,
                },
            });
            if (!existingUser || existingUser.refreshToken !== refreshToken) {
                throw new api_errors_1.ApiError(401, "The user is not authenticated with refreshToken.");
            }
            const cookieData = {
                id: decodeRefreshToken.id,
            };
            const createToken = yield (0, createTokens_1.default)(cookieData, res);
            yield db_1.db.user.update({
                where: {
                    id: decodeRefreshToken.id,
                },
                data: {
                    refreshToken: createToken === null || createToken === void 0 ? void 0 : createToken.refreshToken,
                    accessToken: createToken === null || createToken === void 0 ? void 0 : createToken.accessToken,
                },
            });
            req.user = decodeRefreshToken;
            console.log(createToken, "hiello");
            return next();
            // query to the db that is the user with this refresh token there or not
            // const data = {
            //   id: decodeRefreshToken.id,
            // };
            // if (data) {
            //   const createTokens = tokenCreator(data, res);
            // }
        }
        catch (error) {
            console.error(error, "unable to verify refresh token.");
        }
    }
    else {
        throw new api_errors_1.ApiError(401, "User not authorized to access this route.");
    }
});
exports.isAuthenticated = isAuthenticated;
