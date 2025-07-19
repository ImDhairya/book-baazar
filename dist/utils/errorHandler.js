"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_errors_1 = require("./api-errors");
const errorHandler = (err, req, res, next) => {
    if (err instanceof api_errors_1.ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal Server error.",
        errors: [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.default = errorHandler;
