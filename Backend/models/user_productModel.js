const mongoose = require('mongoose');

const UserProduct = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required!"]
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Product id is required!"]
    },

    review: {
        type: String,
        minLength: [3, "Your review must at least 3 chars!"],
        maxLength: [250, "Your review cannot exceed 200 chars!"]
    },

    // do you think this is good? i like it
    // خلصانة
    stars: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        default: 3,
    },

    date: {
        type: Date,
        default : Date.now(),
    }
});

module.exports = new mongoose.model("UserProduct", UserProduct);