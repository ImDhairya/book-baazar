"use strict";
// import {NextFunction, Request, Response} from "express";
// export const Authenticated = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { token } = req.cookies;
//     if (!token)  {
//       return res.status(401).json({
//         message: 'Authentication token missing.'
//       })
//     }
//     // how do i authenticate from cookie
//     // const user = await user.model.findone({token})
//     // if(!user) {
//     //   return res.status(403).json({message: "Invalid or expired token."});
//     // }
//     next()
//   } catch (error) {
//     console.error(error, "There is an error in middleware authentication.");
//   }
// };
