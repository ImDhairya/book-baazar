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
exports.deleteBook = exports.updateBook = exports.addBook = exports.getBooks = void 0;
const api_response_1 = require("../utils/api-response");
const async_handler_1 = require("../utils/async-handler");
const db_1 = require("../libs/db");
const api_errors_1 = require("../utils/api-errors");
const validator_1 = require("../validator");
exports.getBooks = (0, async_handler_1.asyncHandler)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const books = yield db_1.db.book.findMany({});
    if (books) {
      const response = new api_response_1.ApiResponse(200, books, "Books fetched successfully");
      return res.status(response.statusCode).json(response);
    } else {
      throw new api_errors_1.ApiError(401, "Unable to find books");
    }
  })
);
exports.addBook = (0, async_handler_1.asyncHandler)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const bookData = req.body;
    const validationBooks = validator_1.BookDataValidator.safeParse(bookData);
    console.log(validationBooks, "FFIO");
    if (!validationBooks.success) {
      throw new api_errors_1.ApiError(
        401,
        "Unable to parse data successfully",
        validationBooks.error.issues
      );
    }
    if (!bookData) {
      throw new api_errors_1.ApiError(401, "Please provide all required book data.");
    }
    console.log(req.user, "fefefefef");
    const userId =
      (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0
        ? void 0
        : _a.id;
    const { title, author, price, coAuthor } = bookData;
    const book = yield db_1.db.book.create({
      data: {
        title,
        author,
        price,
        coAuthor,
        userId,
      },
    });
    const apiData = new api_response_1.ApiResponse(201, book);
    console.log(apiData, "raabrakkha");
    return res.status(apiData.statusCode).json(apiData.message);
  })
);
exports.updateBook = (0, async_handler_1.asyncHandler)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const bookData = req.body;
    const userId =
      (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0
        ? void 0
        : _a.id;
    const validationBooks = validator_1.BookDataValidator.safeParse(bookData);
    console.log(validationBooks, "FFIO");
    if (!validationBooks.success) {
      throw new api_errors_1.ApiError(
        401,
        "Unable to parse data successfully",
        validationBooks.error.issues
      );
    }
    const { id } = req.params;
    console.log(id, bookData, "FFFFFFFoioi");
    const { title, author, price, coAuthor } = bookData;
    const existingBook = yield db_1.db.book.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingBook) {
      throw new api_errors_1.ApiError(404, "The book does not exists.");
    }
    const updatedBook = yield db_1.db.book.update({
      where: {
        id: id,
      },
      data: {
        title,
        author,
        price,
        coAuthor,
        userId,
      },
    });
    const apiResponse = new api_response_1.ApiResponse(202, updatedBook);
    return res.status(apiResponse.statusCode).json(apiResponse.data);
  })
);
exports.deleteBook = (0, async_handler_1.asyncHandler)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId =
      (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0
        ? void 0
        : _a.id;
    const { id } = req.params;
    if (!userId) {
      throw new api_errors_1.ApiError(401, "User not verified");
    }
    const existingBook = yield db_1.db.book.findUnique({
      where: {
        id,
      },
    });
    if (
      (existingBook === null || existingBook === void 0 ? void 0 : existingBook.id) !== id &&
      (existingBook === null || existingBook === void 0 ? void 0 : existingBook.userId) !== userId
    ) {
      throw new api_errors_1.ApiError(501, "User is not identified to delete the book.");
    }
    yield db_1.db.book.delete({
      where: {
        id,
      },
    });
    const apiResponse = new api_response_1.ApiResponse(200, {}, "Deleted the book successfully.");
    return res.status(apiResponse.statusCode).json(apiResponse.data);
  })
);
