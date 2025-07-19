import { CookieOptions, NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-errors";
import { LoginUserValidation, RegisterUser } from "../validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../libs/db";
import { ApiResponse } from "../utils/api-response";
import tokenCreator from "../utils/createTokens";

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(401, "User credentials are requred");
    }

    const validationResult = LoginUserValidation.safeParse({ email, password });
    if (!validationResult.success) {
      throw new ApiError(400, "Validation failed", validationResult.error.issues);
    }

    console.log(validationResult, "FFii");
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new ApiError(401, "User does not exists.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(401, "The user credentials do not match please try again.");
    }

    const cookiePayload = {
      id: user.id,
    };
    // bcrypt.compare()
    // generate an access token, which is used in sending sending every request, short lived for 20 mins

    // how to verify from db about refresh and access token

    // on evenry request we go to the db and chekc if the user has the access token
    // i will create a middleware with the name isAuthenticated.

    // in that middleware I will check the update token if it matches then I will allow the permit,

    // now with refresh token whcih is long lived it will be used to keep on generating access token,
    // and what will hapen when the refresh token expires?? do we need the user to login again ???

    // now you will use the isauthenticated flow for the route and if the

    // sending access token aswell

    // res.cookie("accessToken", cookieData, {
    //   maxAge: 1000 * 60 * 20, // 20 mins valid
    // });

    // this is a refresh token lived for 7 days

    const data = await tokenCreator(cookiePayload, res);
    await db.user.update({
      where: {
        email: user.email,
      },
      data: {
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
      },
    });
    console.log(data?.refreshToken, "asstokendsdata");
    const responseData = {
      id: user.id,
      name: user.name,
      userName: user.userName,
    };

    interface DataResponse {
      id: string;
      name: string;
      userName: string;
    }

    const apiResponse = new ApiResponse<DataResponse>(
      200,
      responseData,
      "userLoggedIn successfully."
    );

    return res.status(apiResponse.statusCode).json(apiResponse);

    // return res.status(200).json({
    //   success: true,
    //   message: "Logged in successfully.",
    //   existingUser: {
    //     id: user.id,DataResponse
    //     email: user.email,
    //     name: user.name,
    //   },
    // });
  }
);

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { userName, email, password, name } = req.body;

  if (!userName || !email || !password || !name) {
    throw new ApiError(401, "The required details are not found.");
  }
  console.log(userName, email, password, name, "the user register credentials.");
  const validator = RegisterUser.safeParse({ userName, email, password, name });

  if (!validator.success) {
    throw new ApiError(401, "The validation for data failed.", validator.error.issues);
  }
  const existingUser = await db.user.findUnique({
    where: {
      email: email,
      userName: userName,
    },
  });

  if (existingUser) throw new ApiError(401, "The user already exists please login.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      name: name,
      email: email,
      userName: userName,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      userName: true,
    },
  });

  console.log(user, "DbUser");

  // res.cookie("jwt", token, {
  //     httpOnly: true,
  //     sameSite: "strict",
  //     secure: process.env.NODE_ENV != "development",
  //     maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  //   });

  // const responseData = [user.id, user.name, user.userName];

  // return new ApiResponse(200, responseData, "User Registered Successfully!");

  const responseData = [user.id, user.name, user.userName];
  console.log(responseData, "Validation errror.");

  const apiResponse = new ApiResponse(200, responseData, "User Registered successfully.");

  console.log(apiResponse, "apiresponse");

  return res.status(apiResponse.statusCode).json(apiResponse);
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken || !refreshToken) {
    throw new ApiError(401, "Unable to find cookies ");
  }
  res.cookie("accessToken", "", {
    expires: new Date(),
  });

  res.cookie("refreshToken", "", {
    expires: new Date(),
  });

  const apiResponse = new ApiResponse(201, null, "Logged out successfully");

  return res.status(apiResponse.statusCode).json(apiResponse);
});
