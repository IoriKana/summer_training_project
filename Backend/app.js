const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const staffRoutes = require("./routes/staffRoutes");
const accountRoutes = require("./routes/accountRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const reviewRoutes = require("./routes/user_ProdcutRoutes");
const couponRoutes = require("./routes/couponRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

const whitelist = [
	process.env.ClIENT_URL,
	process.env.ADMIN_URL,
	"https://cdj76xfp-5173.uks1.devtunnels.ms/",
];
const corsOptions = {
	origin: function (origin, callback) {
		console.log("Request origin:", origin);
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("This origin is not allowed by CORS"));
		}
	},
	credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRouter);
app.use("/api/staff", staffRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
