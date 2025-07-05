// class ApiError extends Error {
//   statusCode: number;
//   errors: object[];
//   success: boolean;

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
  // error takes in only one argument which is message of the error
  statusCode: number;
  errors: object[];
  success: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: object[] = [],
    stack: string = ""
  ) {
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

export {ApiError};
