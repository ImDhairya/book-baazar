import { Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { db } from "../libs/db";
import { ApiError } from "../utils/api-errors";
import { User } from "../../generated/prisma";

export interface CustomRequest extends Request {
  user?: User
}

export const getBooks = asyncHandler(async (req: Request, res: Response) => {
  const books = await db.book.findMany({});

  if (books) {
    const response = new ApiResponse(200, books, "Books fetched successfully");
    return res.status(response.statusCode).json(response);
  } else {
    throw new ApiError(401, "Unable to find books");
  }
});

export const addBook = asyncHandler(async (req: CustomRequest, res: Response) => {
  const bookData = req.body;


  if (!bookData) {
    throw new ApiError(401, "Please provide all required book data.")
  }

  console.log(req.user, 'fefefefef')
  const userId = req?.user?.id
  const { title, author, price, coAuthor } = bookData


  const book = await db.book.create({
    data: {
      title,
      author,
      price,
      coAuthor,
      userId,
    }
  })

  const apiData = new ApiResponse(201, book)
  console.log(apiData, "raabrakkha")

  return res.status(apiData.statusCode).json(apiData.message)


})



