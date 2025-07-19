"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewOwner = reviewOwner;
const db_1 = require("../libs/db");
const api_errors_1 = require("../utils/api-errors");
function reviewOwner(req, res, next) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a;
    const userId =
      (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0
        ? void 0
        : _a.id;
    const { id } = req.params;
    if (!userId) {
      return next(new api_errors_1.ApiError(401, "User ID not found in request"));
    }
    try {
      const checkUser = yield db_1.db.user.findUnique({
        where: { id: userId },
      });
      const checkReview = yield db_1.db.review.findUnique({
        where: {
          id,
        },
      });
      if (!checkReview) {
        return next(new api_errors_1.ApiError(401, "The review not found."));
      }
      if (!checkUser) {
        return next(new api_errors_1.ApiError(404, "User not found"));
      }
      if (
        (checkReview === null || checkReview === void 0 ? void 0 : checkReview.userId) !== userId
      ) {
        return next(new api_errors_1.ApiError(404, "User check failed."));
      }
      // User exists
      return next();
    } catch (err) {
      return next(new api_errors_1.ApiError(500, "Internal server error"));
    }
  });
}
