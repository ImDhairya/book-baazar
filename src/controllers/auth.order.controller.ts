import { Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { CustomRequest } from "./auth.book.controller";
import { db } from "../libs/db";
import { ApiError } from "../utils/api-errors";
import { ApiResponse } from "../utils/api-response";
import { orderValiation } from "../validator";

export const getOrders = asyncHandler(async (req: CustomRequest, res: Response) => {
  const orders = await db.order.findMany({});

  if (!orders) {
    throw new ApiError(404, "Unable to gather orders.");
  }

  const apiResponse = new ApiResponse(202, orders);

  return res.status(apiResponse.statusCode).json(apiResponse.data);
});

export const addOrder = asyncHandler(async (req: CustomRequest, res: Response) => {
  const orderData = req.body;

  const order = orderValiation.safeParse(orderData);
  console.log(order, "hi");
  if (!order.success) {
    throw new ApiError(500, "The order is not a valid order ");
  }
  const userId = req?.user?.id;
  if (!userId) {
    throw new ApiError(500, "The user is not authenticated to place order.");
  }
  const { name, status } = orderData;

  const createdOrder = await db.order.create({
    data: {
      name,
      status,
      userId,
    },
  });

  const apiResponse = new ApiResponse(200, createdOrder);

  return res.status(apiResponse.statusCode).json(apiResponse.data);
});

export const getOrderById = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  const order = await db.order.findFirst({
    where: {
      id: id,
    },
  });

  const apiResponse = new ApiResponse(200, order);

  return res.status(apiResponse.statusCode).json(apiResponse.data);
});
