"use strict";
// import express from "express";
// import { handelGetBook } from "../controllers/auth.book.controller";
// import { Authenticated } from "../middlewares/isAuthenticated";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// const bookRoute = express.Router()
// bookRoute.get('/getbook', Authenticated, handelGetBook )
// bookRoute.get('')
// export default bookRoute
const express_1 = __importDefault(require("express"));
const auth_book_controller_1 = require("../controllers/auth.book.controller");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const checkOwner_1 = require("../utils/checkOwner");
const bookRoute = express_1.default.Router();
bookRoute
  .route("/getbooks")
  .get(isAuthenticated_1.isAuthenticated, auth_book_controller_1.getBooks);
bookRoute.route("/addBook").post(isAuthenticated_1.isAuthenticated, auth_book_controller_1.addBook);
bookRoute
  .route("/update/:id")
  .put(isAuthenticated_1.isAuthenticated, auth_book_controller_1.updateBook);
bookRoute
  .route("/delete/:id")
  .delete(
    isAuthenticated_1.isAuthenticated,
    checkOwner_1.accountOwner,
    auth_book_controller_1.deleteBook
  );
exports.default = bookRoute;
