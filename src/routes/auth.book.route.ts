// import express from "express";
// import { handelGetBook } from "../controllers/auth.book.controller";
// import { Authenticated } from "../middlewares/isAuthenticated";

// const bookRoute = express.Router()

// bookRoute.get('/getbook', Authenticated, handelGetBook )
// bookRoute.get('')

// export default bookRoute

import express from "express";
import { addBook, deleteBook, getBooks, updateBook } from "../controllers/auth.book.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { accountOwner } from "../utils/checkOwner";

const bookRoute = express.Router();

bookRoute.route("/getbooks").get(isAuthenticated, getBooks);
bookRoute.route("/addBook").post(isAuthenticated, addBook);
bookRoute.route("/update/:id").put(isAuthenticated, updateBook);
bookRoute.route("/delete/:id").delete(isAuthenticated, accountOwner, deleteBook);

export default bookRoute;
