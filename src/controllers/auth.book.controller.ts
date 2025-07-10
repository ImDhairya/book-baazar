import {Request, Response} from "express";
import {ApiResponse} from "../utils/api-response";
import {asyncHandler} from "../utils/async-handler";
import {db} from "../libs/db";
import {ApiError} from "../utils/api-errors";

export const getBooks = asyncHandler(async (req: Request, res: Response) => {
  const books = await db.book.findMany({});

  if (books) {
    const response = new ApiResponse(200, books, "Books fetched successfully");
    return res.status(response.statusCode).json(response);
  } else {
    throw new ApiError(401, "Unable to find books");
  }
});
