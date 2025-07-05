import {CookieOptions, NextFunction, Request, Response} from "express";
import {asyncHandler} from "../utils/async-handler";
import {ApiError} from "../utils/api-errors";
import {LoginUserValidation, RegisterUser} from "../validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {db} from "../libs/db";
import {ApiResponse} from "../utils/api-response";

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const {email, password} = req.body;
    if (!email || !password) {
      throw new ApiError(401, "User credentials are requred");
    }
    const validationResult = LoginUserValidation.safeParse({email, password});
    if (!validationResult.success) {
      throw new ApiError(
        400,
        "Validation failed",
        validationResult.error.issues
      );
    }

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
      throw new ApiError(
        401,
        "The user credentials do not match please try again."
      );
    }

    const cookiePayload = {
      id: user.id,
    };
    // bcrypt.compare()
    const cookieData = await jwt.sign(cookiePayload, process.env.JWT_SECRET!);

    res.cookie("JWT", cookieData, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV != "development",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
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
    //     id: user.id,
    //     email: user.email,
    //     name: user.name,
    //   },
    // });
  }
);

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const {userName, email, password, name} = req.body;

    if (!userName || !email || !password || !name) {
      throw new ApiError(401, "The required details are not found.");
    }

    const validator = RegisterUser.safeParse({userName, email, password, name});

    if (!validator.success) {
      throw new ApiError(
        401,
        "The validation for data failed.",
        validator.error.issues
      );
    }

    const existingUser = await db.user.findUnique({
      where: {
        email: email,
        userName: userName,
      },
    });

    if (existingUser)
      throw new ApiError(401, "The user already exists please login.");

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

    const jwtPayload = {
      id: user.id,
      name: user.name,
    };

    const token = await jwt.sign(jwtPayload, process.env.JWTSECRET!, {
      expiresIn: "7d",
    });

    // res.cookie("jwt", token, {
    //     httpOnly: true,
    //     sameSite: "strict",
    //     secure: process.env.NODE_ENV != "development",
    //     maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    //   });

    // const responseData = [user.id, user.name, user.userName];

    // return new ApiResponse(200, responseData, "User Registered Successfully!");

    const responseData = [user.id, user.name, user.userName];

    const apiResponse = new ApiResponse(
      200,
      responseData,
      "User Registered successfully."
    );

    return res.status(apiResponse.statusCode).json(apiResponse);
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies.jwt;
    console.log(token);

    if (!token) {
      throw new ApiError(401, "Unable to find cookies ");
    }

    res.cookie("jwt", "", {
      expires: new Date(),
    });

    const apiResponse = new ApiResponse(201, null, "Logged out successfully");

    return res.status(apiResponse.statusCode).json(apiResponse);
  }
);
