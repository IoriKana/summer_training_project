const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
});

module.exports = new mongoose.model("Cart", cartSchema);


// mr maged
// we said total is derived attribute
// calculated
// not stored in database
// it is calculated each time you look at your cart


// do we put startOrder in cartController or orderController
// i think orderController makes morse sense







// so /cart/confirm to start order? ok
//cart confirmation that make the order we can't place order from order is not exist  yes 