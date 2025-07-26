const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [3, "category title must be at least 3 char"],
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const category = new mongoose.model("Category", categorySchema);
module.exports = category;
