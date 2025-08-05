import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage.jsx";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage.jsx";

function App() {
	return (
		<div className="mx-4">
			<Navbar />
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<HomePage />} />;
				<Route path="/products/:productId" element={<ProductPage />} />
				<Route path="/not-found" element={<NotFoundPage />} />
				<Route path="/signup" element={<SignUpPage />} />
			</Routes>
		</div>
	);
}
export default App;
