import * as z from "zod/v4";

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

export const RegisterUser = z.object({
  name: z.string().refine((name) => /^[a-zA-Z ]{2,}$/.test(name)),
  userName: z.string().max(10, "The username can be maximum of 10 letters"),
  email: emailValidation,
  password: z
    .string()
    .min(5, "The password should be atleast 5 characters strong.")
    .refine((password) => /\d/.test(password)),
});

export const LoginUserValidation = z.object({
  // userName: z.string().max(10, "The username can be maximum of 10 letters"),
  password: passwordValidator,
  email: emailValidation,
});

export const BookDataValidator = z.object({
  title: z.string("Please provide title."),
  author: z.string("Please provide author."),
  price: z.number("Please make sure price is mentioned."),
  coAuthor: z.string().optional(),
});

export const reviewDataValidatoin = z.object({
  rating: z.number(),
  content: z.string(),
  bookId: z.string(),
});

export const orderValiation = z.object({
  name: z.string("The name of the order is required"),
  status: z.string("Please provide the status of the order."),
});
