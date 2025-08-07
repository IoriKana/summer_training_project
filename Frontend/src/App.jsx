import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage.jsx";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProfileImagePage from "./pages/ProfileImagePage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
// import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

function App() {
	return (
		<div className="mx-4">
			<Navbar />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/products/:productId" element={<ProductPage />} />
				<Route path="/not-found" element={<NotFoundPage />} />
				<Route path="/signup" element={<SignUpPage />} />
				<Route path="/set-profile-image" element={<ProfileImagePage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/cart" element={<CartPage />} />
				<Route path="/order/:orderId" element={<OrderPage />} />
				<Route path="/orders" element={<OrderHistoryPage />} />
				<Route path="/contact" element={<ContactPage />} />
				<Route path="/about" element={<AboutPage />} />
				{/* <Route path="/forgot-password" element={<ForgotPasswordPage />} />
				<Route path="/reset-password/:email" element={<ResetPasswordPage />} /> */}
			</Routes>
		</div>
	);
}
export default App;
