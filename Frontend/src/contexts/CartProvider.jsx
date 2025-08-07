import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContext.js";
import { useAuth } from "../hooks/useAuth.js";
import {
	makeGet,
	makePost,
	makePatch,
	makeDelete,
} from "../utils/makeRequest.js";

const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const { authToken, isLoading: isAuthLoading } = useAuth();

	useEffect(() => {
		const fetchCart = async () => {
			if (isAuthLoading) {
				return;
			}

			if (authToken) {
				setIsLoading(true);
				try {
					console.log("Attempting to fetch cart...");
					const response = await makeGet("cart");

					console.log("Cart API Response:", response);

					if (response && response.items) {
						setCartItems(response.items);
					} else if (response.data && response.data.items) {
						setCartItems(response.data.items);
					} else {
						console.warn(
							"Cart response received, but it did not contain a recognized '.items' array.",
							response
						);
						setCartItems([]);
					}
				} catch (err) {
					console.error("Failed to fetch cart:", err);
					if (err.message?.includes("Cart not found")) {
						setCartItems([]);
					} else {
						setError(err.message);
					}
				} finally {
					setIsLoading(false);
				}
			} else {
				setCartItems([]);
			}
		};
		fetchCart();
	}, [authToken, isAuthLoading]);

	const addToCart = async (product, quantity) => {
		const optimisticItem = { ...product, quantity, productId: product };
		setCartItems((prevItems) => {
			const existingItem = prevItems.find(
				(item) => item.productId?._id === product._id
			);
			if (existingItem) {
				return prevItems.map((item) =>
					item.productId?._id === product._id
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			}
			return [...prevItems, optimisticItem];
		});

		try {
			await makePost("cart/items", { productId: product._id, quantity });
		} catch (err) {
			setError(err.message);
			if (authToken) {
				const response = await makeGet("cart");
				setCartItems(response.items || []);
			}
		}
	};

	const updateCartProductQuantity = async (productId, newQuantity) => {
		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.productId?._id === productId
					? { ...item, quantity: newQuantity }
					: item
			)
		);
		try {
			await makePatch(`cart/items/${productId}`, { quantity: newQuantity });
		} catch (err) {
			setError(err.message);
			if (authToken) {
				const response = await makeGet("cart");
				setCartItems(response.items || []);
			}
		}
	};

	const removeFromCart = async (productId) => {
		setCartItems((prevItems) =>
			prevItems.filter((item) => item.productId?._id !== productId)
		);
		try {
			await makeDelete(`cart/items/${productId}`);
		} catch (err) {
			setError(err.message);
			if (authToken) {
				const response = await makeGet("cart");
				setCartItems(response.items || []);
			}
		}
	};

	const clearCart = () => {
		setCartItems([]);
	};

	const value = {
		cartItems,
		isLoading,
		error,
		addToCart,
		updateCartProductQuantity,
		removeFromCart,
		clearCart,
		itemCount: cartItems.reduce((total, item) => total + item.quantity, 0),
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
