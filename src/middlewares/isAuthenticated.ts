import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import tokenCreator from "../utils/createTokens";
import { ApiError } from "../utils/api-errors";
import { db } from "../libs/db";

interface AuthenticatedResponse extends Response {
  user?: string | JwtPayload;
}
interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload
}
export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: AuthenticatedResponse,
  next: NextFunction
) => {
  const { refreshToken, accessToken } = req.cookies;

  try {
    if (accessToken) {
      const decodedData = jwt.verify(accessToken, process.env.ACCESS_SECRET!);

      req.user = decodedData;
      return next();
    } else {
      console.log("Access token not there.");
    }
  } catch (error) {
    // access token is not present
    console.log(error, "The access token is not present");
  }

  if (refreshToken) {
    console.log("Refreshtoken", refreshToken);
    try {
      const decodeRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET!) as JwtPayload;

      // query to the db for the user and check both existing user and the db for the user is working or not.

      const existingUser = await db.user.findUnique({
        where: {
          id: decodeRefreshToken.id,
        },
      });

      if (!existingUser || existingUser.refreshToken !== refreshToken) {
        throw new ApiError(401, "The user is not authenticated with refreshToken.");
      }
      const cookieData = {
        id: decodeRefreshToken.id,
      };
      const createToken = await tokenCreator(cookieData, res);

      await db.user.update({
        where: {
          id: decodeRefreshToken.id,
        },
        data: {
          refreshToken: createToken?.refreshToken,
          accessToken: createToken?.accessToken,
        },
      });
      req.user = decodeRefreshToken
      console.log(createToken, "hiello");
      return next();
      // query to the db that is the user with this refresh token there or not
      // const data = {
      //   id: decodeRefreshToken.id,
      // };
      // if (data) {
      //   const createTokens = tokenCreator(data, res);
      // }
    } catch (error) {
      console.error(error, "unable to verify refresh token.");
    }
  } else {
    throw new ApiError(401, "User not authorized to access this route.");
  }
};
