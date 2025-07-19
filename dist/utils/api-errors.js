"use strict";
// class ApiError extends Error {
//   statusCode: number;
//   errors: object[];
//   success: boolean;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
//   constructor(
//     statusCode: number,
//     message: string,
//     errors: object[] = [],
//     stack: string = ""
//   ) {
//     super(message);
//     Object.setPrototypeOf(this, new.target.prototype);
//     this.statusCode = statusCode;
//     this.errors = errors;
//     this.success = false;
//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }
// export {ApiError};
class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
exports.ApiError = ApiError;
