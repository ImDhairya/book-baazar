import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { db } from "../libs/db";
import { ApiError } from "../utils/api-errors";

export const healthCheckController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await db.$queryRaw`SELECT 1`;
      next();
    } catch (error) {
      console.error("🛑 Database connection failed:", error);
      next(new ApiError(500, "Database not connected"));
    }
  }
);

// app.get("/healthCheck", (req, res) => {
//   return res.send("The app is working and healthy.");
// });
