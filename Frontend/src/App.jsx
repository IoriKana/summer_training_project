import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage.jsx";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
	return (
		<div className="mx-4 sm:mx-[10%]">
			<Navbar />
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/home" element={<HomePage />} />;
				<Route path="/products/:productId" element={<ProductPage />} />
				<Route path="/not-found" element={<NotFoundPage />} />
			</Routes>
		</div>
	);
}
export default App;
