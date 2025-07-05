"use strict";
// class ApiResponse {
//   statusCode: number;
//   data: Object[];
//   success: boolean;
//   message: string;
//   constructor(statusCode: number, data: Object[], message = "Success") {
//     this.statusCode = statusCode;
//     this.data = data;
//     this.message = message;
//     this.success = statusCode < 400;
//   }
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.success = statusCode < 400;
        this.message = message;
    }
}
exports.ApiResponse = ApiResponse;
