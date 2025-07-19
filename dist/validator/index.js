"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookDataValidator = exports.LoginUserValidation = exports.RegisterUser = void 0;
const z = __importStar(require("zod/v4"));
const emailValidation = z
  .email("Invalid email format.")
  .refine((email) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email), {
    message: "The email validation did not pass.",
  });
const userNameValidator = z.string("This should be a string");
const passwordValidator = z
  .string()
  .min(5, "The min length of a password is 5.")
  .refine((pass) => /\d/.test(pass));
exports.RegisterUser = z.object({
  name: z.string().refine((name) => /^[a-zA-Z ]{2,}$/.test(name)),
  userName: z.string().max(10, "The username can be maximum of 10 letters"),
  email: emailValidation,
  password: z
    .string()
    .min(5, "The password should be atleast 5 characters strong.")
    .refine((password) => /\d/.test(password)),
});
exports.LoginUserValidation = z.object({
  // userName: z.string().max(10, "The username can be maximum of 10 letters"),
  password: passwordValidator,
  email: emailValidation,
});
exports.BookDataValidator = z.object({
  title: z.string(),
  author: z.string(),
  price: z.number(),
  coAuthor: z.string().optional(),
});
