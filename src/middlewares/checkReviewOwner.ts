import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../controllers/auth.book.controller";
import { db } from "../libs/db";
import { ApiError } from "../utils/api-errors";

export async function reviewOwner(req: CustomRequest, res: Response, next: NextFunction) {
  const userId = req?.user?.id;
  const { id } = req.params;

  if (!userId) {
    return next(new ApiError(401, "User ID not found in request"));
  }

  try {
    const checkUser = await db.user.findUnique({
      where: { id: userId },
    });

    const checkReview = await db.review.findUnique({
      where: {
        id,
      },
    });
    if (!checkReview) {
      return next(new ApiError(401, "The review not found."));
    }

    if (!checkUser) {
      return next(new ApiError(404, "User not found"));
    }

    if (checkReview?.userId !== userId) {
      return next(new ApiError(404, "User check failed."));
    }

    // User exists
    return next();
  } catch (err) {
    return next(new ApiError(500, "Internal server error"));
  }
}
