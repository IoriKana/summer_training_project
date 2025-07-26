const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    sub_total: {
        type: Number,
        required: [true, "Sub total is required"],
        min: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
});

module.exports = new mongoose.model("Cart", cartSchema);