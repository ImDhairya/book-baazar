"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const auth_review_controller_1 = require("../controllers/auth.review.controller");
const checkReviewOwner_1 = require("../middlewares/checkReviewOwner");
const reviewRoutes = (0, express_1.Router)();
reviewRoutes
  .route("/getreviews")
  .get(isAuthenticated_1.isAuthenticated, auth_review_controller_1.getReviewRoutes);
reviewRoutes.route("/getreview/:id").get(isAuthenticated_1.isAuthenticated);
reviewRoutes
  .route("/deletereview/:id")
  .delete(
    isAuthenticated_1.isAuthenticated,
    checkReviewOwner_1.reviewOwner,
    auth_review_controller_1.deleteReveiew
  );
reviewRoutes
  .route("/addreview")
  .post(isAuthenticated_1.isAuthenticated, auth_review_controller_1.addReview);
exports.default = reviewRoutes;
