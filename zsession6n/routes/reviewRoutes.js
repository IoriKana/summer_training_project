const express = require("express");
const {
  getAllReview,
  createReview,
} = require("../controllers/reviewController");

const reviewRouter = express.Router();

reviewRouter.get("/", getAllReview);
reviewRouter.post("/createReview", createReview);

module.exports = reviewRouter;
