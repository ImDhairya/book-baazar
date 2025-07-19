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
exports.healthCheckController = void 0;
const async_handler_1 = require("../utils/async-handler");
const db_1 = require("../libs/db");
const api_errors_1 = require("../utils/api-errors");
exports.healthCheckController = (0, async_handler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.db.$queryRaw `SELECT 1`;
        next();
    }
    catch (error) {
        console.error("🛑 Database connection failed:", error);
        next(new api_errors_1.ApiError(500, "Database not connected"));
    }
}));
// app.get("/healthCheck", (req, res) => {
//   return res.send("The app is working and healthy.");
// });
