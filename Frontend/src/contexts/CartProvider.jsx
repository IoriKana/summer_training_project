import React, { useState, useEffect } from "react";
import { CartContext } from "./CartContext.js";
import { useAuth } from "../hooks/useAuth.js";
import {
	makeGet,
	makePost,
	makeDelete,
	makePatch,
} from "../utils/makeRequest.js";

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const { authToken } = useAuth();

	useEffect(() => {
		const fetchCart = async () => {
			if (!authToken) {
				setCartItems([]);
			} else {
				setIsLoading(true);
				try {
					const response = await makeGet("cart");
					setCartItems(response.items || []);
				} catch (err) {
					if (err.message.includes("Cart not found")) {
						setCartItems([]);
					} else {
						setError(err.message);
					}
				} finally {
					setIsLoading(false);
				}
			}
		};
		fetchCart();
	}, [authToken]);

	const addToCart = async (product, quantity) => {
		const optimisticItem = { ...product, quantity, productId: product };
		setCartItems((i) => {
			const existingItem = i.find((item) => item.productId._id === product._id);
			if (existingItem) {
				return i.map((item) =>
					item.productId._id === product._id
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			}
			return [...i, optimisticItem];
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
		setCartItems((i) =>
			i.map((item) =>
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
		setCartItems((i) => i.filter((item) => item.productId._id !== productId));
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

	const value = {
		cartItems,
		isLoading,
		error,
		addToCart,
		updateCartProductQuantity,
		removeFromCart,
		itemCount: cartItems.reduce((total, item) => total + item.quantity, 0),
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
