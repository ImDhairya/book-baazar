import express from "express";
import cors from "cors";
import userRoutes from "./routes/auth.user.route";
// import bookRoute from "./routes/auth.book.route";
import errorHandler from "./utils/errorHandler";
import cookieParser from "cookie-parser";
import bookRoute from "./routes/auth.book.route";
import { healthCheckController } from "./middlewares/healthCheck";

const app = express();
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET || "defaultSecret"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET || "defaultSecret"));

app.use(healthCheckController);
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/book", bookRoute);

// app.use("/api/v1/books", bookRoute);
// app.get("/", (req, res) => {
//   res.send({message: "App is working "});
// });

app.get("/healthCheck", (req, res) => {
  return res.send("The app is working and healthy.");
});

app.use(errorHandler);
export default app;
