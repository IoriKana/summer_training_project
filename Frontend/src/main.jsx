import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import CartProvider from "./contexts/CartProvider.jsx";

createRoot(document.getElementById("root")).render(
	<AuthProvider>
		<CartProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</CartProvider>
	</AuthProvider>
);
