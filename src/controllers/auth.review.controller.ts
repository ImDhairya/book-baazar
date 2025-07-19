import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { CustomRequest } from "./auth.book.controller";
import { ApiError } from "../utils/api-errors";
import { db } from "../libs/db";
import { ApiResponse } from "../utils/api-response";
import { reviewDataValidatoin } from "../validator";

export const getReviewRoutes = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?.id;

    if (!userId) {
      throw new ApiError(401, "The user is not authenticated, please login first.");
    }

    const reviews = await db.review.findMany({});

    if (!reviews) {
      return new ApiError(404, "Couldn't find any reviews.");
    }
    const apiResponse = new ApiResponse(201, reviews);

    return res.status(apiResponse.statusCode).json(apiResponse.data);
  }
);

export const getReviewById = asyncHandler(async (req: CustomRequest, res: Response) => {
  const userId = req?.user?.id;

  if (!userId) {
    throw new ApiError(401, "The user is not authenticated, please login first.");
  }

  const { id } = req.params;

  const review = await db.review.findUnique({
    where: {
      id: id,
    },
  });

  const apiResponse = new ApiResponse(200, review);

  return res.status(apiResponse.statusCode).json(apiResponse.data);
});

export const deleteReveiew = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  const review = await db.review.delete({
    where: {
      id: id,
    },
  });

  const apiResponse = new ApiResponse(200, review);

  return res.status(apiResponse.statusCode).json(apiResponse.data);
});

export const addReview = asyncHandler(async (req: CustomRequest, res: Response) => {
  const reviewData = req.body;

  const { content, rating, bookId } = reviewData;

  const validateReveiews = reviewDataValidatoin.safeParse(reviewData);

  if (!validateReveiews.success) {
    throw new ApiError(500, "Unable to validate the review data.");
  }

  const userId = req?.user?.id;

  if (!userId) {
    throw new ApiError(401, "The user is not authenticated, please login first.");
  }

  const reviewRating = await db.review.create({
    data: {
      content,
      rating,
      userId: userId,
      bookId: bookId,
    },
  });

  if (!reviewRating) {
    throw new ApiError(500, "Unable to create a review right now.");
  }

  const apiResp = new ApiResponse(201, reviewRating);

  return res.status(apiResp.statusCode).json(apiResp.data);
});
