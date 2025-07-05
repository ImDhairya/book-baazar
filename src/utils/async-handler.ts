import {NextFunction, RequestHandler, Request, Response} from "express";

export function asyncHandler(
  requestHandler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
}

// class myProfile<ContentValue, Name, MyAge, MyAddress> {
//   content: ContentValue;
//   name: Name;
//   age: MyAge;
//   address: MyAddress;

//   constructor(values: {
//     content: ContentValue;
//     name: Name;
//     age: MyAge;
//     address: MyAddress;
//   }) {
//     this.content = values.content;
//     this.name = values.name;
//     this.age = values.age;
//     this.address = values.address;
//   }
// }

// const myProf = new myProfile<string, string, number, string>({
//   content: "Hello world this is my first blog and i am here to live by it.",
//   name: "Dhairya",
//   age: 22,
//   address: "C-3 Pramukh kutir society.",
// });
