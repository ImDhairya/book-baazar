"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function apiResssponse(requestTobehandled) {
  return (req, res, next) => {
    Promise.resolve(requestTobehandled).catch((err) => next(err));
  };
}
class APiRR extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statuScode = statusCode;
    this.message = message;
  }
}
class APirresp {}
