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
        maxLength: [200, "Your review cannot exceed 200 chars!"]
    },

    date: {
        type: Date,
        required: [true, "Date is required!"]
    }
});

module.exports = new mongoose.model("UserProduct", UserProduct);