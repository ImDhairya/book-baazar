import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { addOrder, getOrderById, getOrders } from "../controllers/auth.order.controller";

const orderRoutes = Router();

orderRoutes.route("/addorder").post(isAuthenticated, addOrder);
orderRoutes.route("/getorders").get(isAuthenticated, getOrders);
orderRoutes.route("/orderid/:id").get(isAuthenticated, getOrderById);

export default orderRoutes;
