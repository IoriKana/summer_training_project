const express = require("express");
const {protect} = require("../controllers/authController");
const {restrictTo} = require("../controllers/authController");
const {
    getAllCarts,
    getCart,
    CartConfirm
} = require("../controllers/cartController");

const {
    addProductToCart,
    getCartProducts,
    updateCartProductQuantity,
    removeProductFromCart,
    clearCart
} = require("../controllers/product_cartController");


const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.delete("/", clearCart);

// Product-related cart operations
router.post("/items", addProductToCart);
router.patch("/items/:id", updateCartProductQuantity);
router.delete("/items/:id", removeProductFromCart);

// Admin/staff access to all carts
router.get("/all", restrictTo("Admin", "Staff"), getAllCarts);

// Confirm checkout
router.post("/confirm", CartConfirm);

module.exports = router;