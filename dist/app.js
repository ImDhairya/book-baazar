"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_user_route_1 = __importDefault(require("./routes/auth.user.route"));
// import bookRoute from "./routes/auth.book.route";
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_book_route_1 = __importDefault(require("./routes/auth.book.route"));
const healthCheck_1 = require("./middlewares/healthCheck");
const auth_review_route_1 = __importDefault(require("./routes/auth.review.route"));
const auth_order_route_1 = __importDefault(require("./routes/auth.order.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET || "defaultSecret"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET || "defaultSecret"));
app.use(healthCheck_1.healthCheckController);
app.use("/api/v1/auth", auth_user_route_1.default);
app.use("/api/v1/book", auth_book_route_1.default);
app.use("/api/v1/review", auth_review_route_1.default);
app.use("/api/v1/order", auth_order_route_1.default);
// app.use("/api/v1/books", bookRoute);
// app.get("/", (req, res) => {
//   res.send({message: "App is working "});
// });
app.get("/healthCheck", (req, res) => {
  return res.send("The app is working and healthy.");
});
app.use(errorHandler_1.default);
exports.default = app;
