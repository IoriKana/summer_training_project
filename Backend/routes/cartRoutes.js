const express = require("express");
const router = express.Router();
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


router.use(protect)

router.get("/", getCart)
router.delete("/", clearCart)

router.post("/product", addProductToCart)


router.patch("/products/:id", updateCartProductQuantity)
router.delete("/products/:id", removeProductFromCart)


router.get("/getall",restrictTo("Admin","Staff") ,getAllCarts)

router.post("/confirm",CartConfirm);

module.exports = router;
