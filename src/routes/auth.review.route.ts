import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { addReview, deleteReveiew, getReviewRoutes } from "../controllers/auth.review.controller";
import { reviewOwner } from "../middlewares/checkReviewOwner";

const reviewRoutes = Router();

reviewRoutes.route("/getreviews").get(isAuthenticated, getReviewRoutes);
reviewRoutes.route("/getreview/:id").get(isAuthenticated);
reviewRoutes.route("/deletereview/:id").delete(isAuthenticated, reviewOwner, deleteReveiew);
reviewRoutes.route("/addreview").post(isAuthenticated, addReview);

export default reviewRoutes;
