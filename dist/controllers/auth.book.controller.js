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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooks = void 0;
const api_response_1 = require("../utils/api-response");
const async_handler_1 = require("../utils/async-handler");
const db_1 = require("../libs/db");
const api_errors_1 = require("../utils/api-errors");
exports.getBooks = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield db_1.db.book.findMany({});
    if (books) {
        const response = new api_response_1.ApiResponse(200, books, "Books fetched successfully");
        return res.status(response.statusCode).json(response);
    }
    else {
        throw new api_errors_1.ApiError(401, "Unable to find books");
    }
}));
