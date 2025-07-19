import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CookieInterface {
  id: string;
}

const tokenCreator = async (cookiePayload: CookieInterface, res: Response) => {
  if (cookiePayload) {
    try {
      const accessToken = await jwt.sign(cookiePayload, process.env.ACCESS_SECRET!, {
        expiresIn: "1d",
      });

      const refreshToken = await jwt.sign(cookiePayload, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });
      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 20, // 20 mins valid
      });
      // console.log(res.cookie, "TOKENS");

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV != "development",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      console.log(accessToken, "hi", refreshToken);
      // if (next) next();
      return { accessToken, refreshToken };
    } catch (error) {
      console.log("HIIHIHIHIHIHIHI", error);
    }
  }
};

export default tokenCreator;
