import {NextFunction, Request, Response} from "express";
import {ApiError} from "../utils/api-errors";
import {db} from "../libs/db";
import jwt, {JwtPayload} from "jsonwebtoken";

interface AuthenticatedResponse extends Response {
  user?: string | JwtPayload; // replace with your actual payload shape
}

export const isAuthenticated = async (
  req: Request,
  res: AuthenticatedResponse,
  next: NextFunction
) => {
  const {jwtToken} = req.cookies;

  if (!jwtToken) {
    throw new ApiError(501, "User authentication failed");
  }

  const decode = await jwt.verify(jwtToken, process.env.JWT_SECRET!);

  if (decode) {
    res.user = decode;
    next();
  } else {
    throw new ApiError(501, "User not authenticated to this route.");
  }
};
