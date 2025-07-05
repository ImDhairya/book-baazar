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

class ApiResponse<DataResponse> {
  statusCode: number;
  data: DataResponse;
  success: boolean;
  message: string;

  constructor(statusCode: number, data: DataResponse, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.success = statusCode < 400;
    this.message = message;
  }
}

export {ApiResponse};
