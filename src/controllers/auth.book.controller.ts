import { Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { db } from "../libs/db";
import { ApiError } from "../utils/api-errors";
import { User } from "../../generated/prisma";
import { BookDataValidator } from "../validator";

export interface CustomRequest extends Request {
  user?: User;
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
    throw new ApiError(401, "Please provide all required book data.");
  }

  console.log(req.user, "fefefefef");
  const userId = req?.user?.id;
  const { title, author, price, coAuthor } = bookData;

  const book = await db.book.create({
    data: {
      title,
      author,
      price,
      coAuthor,
      userId,
    },
  });

  const apiData = new ApiResponse(201, book);
  console.log(apiData, "raabrakkha");

  return res.status(apiData.statusCode).json(apiData.message);
});

export const updateBook = asyncHandler(async (req: CustomRequest, res: Response) => {
  const bookData = req.body;
  const userId = req?.user?.id;
  const validationBooks = BookDataValidator.safeParse(bookData);

  if (!validationBooks.success) {
    throw new ApiError(401, "Unable to parse data successfully", validationBooks.error.issues);
  }
  const { id } = req.params;
  console.log(id, bookData, "FFFFFFFoioi");

  const { title, author, price, coAuthor } = bookData;

  const existingBook = await db.book.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingBook) {
    throw new ApiError(404, "The book does not exists.");
  }

  const updatedBook = await db.book.update({
    where: {
      id: id,
    },
    data: {
      title,
      author,
      price,
      coAuthor,
      userId,
    },
  });

  const apiResponse = new ApiResponse(202, updatedBook);

  return res.status(apiResponse.statusCode).json(apiResponse.data);
});

export const deleteBook = asyncHandler(async (req: CustomRequest, res: Response) => {
  const userId = req?.user?.id;

  const { id } = req.params;

  if (!userId) {
    throw new ApiError(401, "User not verified");
  }

  const existingBook = await db.book.findUnique({
    where: {
      id,
    },
  });

  if (existingBook?.id !== id && existingBook?.userId !== userId) {
    throw new ApiError(501, "User is not identified to delete the book.");
  }

  await db.book.delete({
    where: {
      id,
    },
  });

  const apiResponse = new ApiResponse(200, {}, "Deleted the book successfully.");

  return res.status(apiResponse.statusCode).json(apiResponse.data);
});
