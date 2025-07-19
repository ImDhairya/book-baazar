"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const auth_order_controller_1 = require("../controllers/auth.order.controller");
const orderRoutes = (0, express_1.Router)();
orderRoutes
  .route("/addorder")
  .post(isAuthenticated_1.isAuthenticated, auth_order_controller_1.addOrder);
orderRoutes
  .route("/getorders")
  .get(isAuthenticated_1.isAuthenticated, auth_order_controller_1.getOrders);
orderRoutes
  .route("/orderid/:id")
  .get(isAuthenticated_1.isAuthenticated, auth_order_controller_1.getOrderById);
exports.default = orderRoutes;
