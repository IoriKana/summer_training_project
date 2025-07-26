const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "review content is required"],
      minlength: [10, "review content must be at least 10 char"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "review rating is required"],
      min: [1, "must not less than 1"],
      max: [5, "must not greater than 5"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const review = new mongoose.model("Review", reviewSchema);
module.exports = review;
