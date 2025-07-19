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
exports.getOrderById = exports.addOrder = exports.getOrders = void 0;
const async_handler_1 = require("../utils/async-handler");
const db_1 = require("../libs/db");
const api_errors_1 = require("../utils/api-errors");
const api_response_1 = require("../utils/api-response");
const validator_1 = require("../validator");
exports.getOrders = (0, async_handler_1.asyncHandler)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield db_1.db.order.findMany({});
    if (!orders) {
      throw new api_errors_1.ApiError(404, "Unable to gather orders.");
    }
    const apiResponse = new api_response_1.ApiResponse(202, orders);
    return res.status(apiResponse.statusCode).json(apiResponse.data);
  })
);
exports.addOrder = (0, async_handler_1.asyncHandler)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const orderData = req.body;
    const order = validator_1.orderValiation.safeParse(orderData);
    console.log(order, "hi");
    if (!order.success) {
      throw new api_errors_1.ApiError(500, "The order is not a valid order ");
    }
    const userId =
      (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0
        ? void 0
        : _a.id;
    if (!userId) {
      throw new api_errors_1.ApiError(500, "The user is not authenticated to place order.");
    }
    const { name, status } = orderData;
    const createdOrder = yield db_1.db.order.create({
      data: {
        name,
        status,
        userId,
      },
    });
    const apiResponse = new api_response_1.ApiResponse(200, createdOrder);
    return res.status(apiResponse.statusCode).json(apiResponse.data);
  })
);
exports.getOrderById = (0, async_handler_1.asyncHandler)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield db_1.db.order.findFirst({
      where: {
        id: id,
      },
    });
    const apiResponse = new api_response_1.ApiResponse(200, order);
    return res.status(apiResponse.statusCode).json(apiResponse.data);
  })
);
