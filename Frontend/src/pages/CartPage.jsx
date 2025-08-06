import React from "react";
import { useCart } from "../hooks/useCart";
import CartItem from "../components/CartItem";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const CartPage = () => {
	const {
		cartItems,
		removeFromCart,
		updateCartProductQuantity,
		itemCount,
		isLoading,
	} = useCart();

	const navigate = useNavigate();

	const subtotal = cartItems.reduce((total, item) => {
		return total + (item.productId?.price || 0) * item.quantity;
	}, 0);

	const handleCheckout = () => {
		navigate("/checkout");
	};

	if (isLoading) {
		return <div className="text-center p-10">Loading Cart...</div>;
	}

	if (itemCount === 0) {
		return (
			<div className="text-center p-10 min-h-[60vh] flex flex-col justify-center items-center">
				<h1 className="text-3xl font-bold text-dark-gray mb-4">
					Your Cart is Empty
				</h1>
				<p className="text-gray-600 mb-6">
					Looks like you haven't added anything to your cart yet.
				</p>
				<Link to="/">
					<Button text="Start Shopping" />
				</Link>
			</div>
		);
	}

	return (
		<div className="bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue min-h-screen p-4 sm:p-8">
			<div className="container mx-auto">
				<h1 className="text-4xl font-bold text-white text-shadow-md mb-8 font-heading">
					Cart
				</h1>

				<div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
					<div className="lg:col-span-2 space-y-4">
						{cartItems.map((item) => (
							<CartItem
								key={item._id}
								item={item}
								onRemove={removeFromCart}
								onUpdateQuantity={updateCartProductQuantity}
							/>
						))}
					</div>

					<div className="lg:col-span-1 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 sticky top-24 mt-8 lg:mt-0">
						<h2 className="text-2xl font-bold text-dark-gray border-b pb-4 mb-4">
							Order Summary
						</h2>
						<div className="space-y-2 text-gray-700">
							<div className="flex justify-between">
								<span>Subtotal</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span>Shipping</span>
								<span>TBD</span>
							</div>
							<div className="flex justify-between font-bold text-dark-gray text-lg pt-4 border-t mt-4">
								<span>Total</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>
						</div>
						<div className="mt-6">
							<Button text="Proceed to Checkout" onClick={handleCheckout} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
