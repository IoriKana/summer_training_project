const express = require("express");
const {protect} = require("../controllers/authController");
const {restrictTo} = require("../controllers/authController");
const {
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    getUserOrders,
    getUserOrderById
} = require("../controllers/orderController");


const router = express.Router();

router.use(protect);

// User order routes
router.get("/", getUserOrders);
router.get("/:id", getUserOrderById);

// Update/delete orders
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);

// Admin/staff routes
router.use(restrictTo("Admin", "Staff"));
router.get("/all", getAllOrders);
router.get("/all/:id", getOrderById);

module.exports = router;
//انا عاوز الرد الي بيوصل بعد ما بينضيف الايتم ونعمل الاوردر 
// اعمل اوردر وصورلي الرد 
// you have access to server! but ok!



/*
{
    "message": "Order created",
    "length": null,
    "data": {
        "shippingStatus": "Pending",
        "paymentStatus": "Pending",
        "orderDate": "2025-08-02T15:00:15.147Z",
        "totalCost": 2290,
        "user": "688ceedf359788fcc9fd68f8",
        "cart": "688e280c5198bccfc7849c59",
        "_id": "688e28125198bccfc7849c65",
        "__v": 0
    }
}
*/
// where the items ? 

// wahh
// its ok easy fix 
 // but the cart is deleted 
 // we need add in model items ? 

// like this?