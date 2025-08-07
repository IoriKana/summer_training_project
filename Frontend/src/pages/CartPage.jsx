import React, { useState, useMemo } from "react";
import { useCart } from "../hooks/useCart";
import CartItem from "../components/CartItem";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { makeGet, makePost } from "../utils/makeRequest";
import CouponField from "../components/CouponField";
import ErrorMessage from "../components/ErrorMessage";

const CartPage = () => {
	const {
		cartItems,
		removeFromCart,
		updateCartProductQuantity,
		itemCount,
		isLoading,
		clearCart,
	} = useCart();
	const navigate = useNavigate();

	const [couponCode, setCouponCode] = useState("");
	const [couponDiscount, setCouponDiscount] = useState(0);
	const [couponError, setCouponError] = useState(null);
	const [isCheckingOut, setIsCheckingOut] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [error, setError] = useState(null);

	const VAT = 0.14;
	const service_fees = 10;
	const shippingPrice = 10;

	const subtotal = useMemo(() => {
		return cartItems.reduce((total, item) => {
			return total + (item.productId?.price || 0) * item.quantity;
		}, 0);
	}, [cartItems]);

	const total = useMemo(() => {
		return subtotal + subtotal * VAT + service_fees + shippingPrice;
	}, [subtotal, VAT, service_fees, shippingPrice]);

	const discountAmount = subtotal * couponDiscount;
	const finalTotal = total - discountAmount; // Corrected to use `total`

	const handleApplyCoupon = async () => {
		setError(null);
		if (!couponCode) return;
		try {
			const response = await makeGet(`coupon/${couponCode}`);
			if (response.data && response.data.discount) {
				setCouponDiscount(response.data.discount);
				setCouponError(null);
			}
		} catch (err) {
			setCouponDiscount(0);
			setCouponError(err.message || "Invalid coupon code.");
		}
	};

	const handleCheckout = async () => {
		setIsCheckingOut(true);
		try {
			const order = await makePost("cart/confirm", { couponText: couponCode });
			clearCart();
			navigate(`/order/${order.data._id}`);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsCheckingOut(false);
		}
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
					Shopping Cart
				</h1>

				<div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
					<div className="lg:col-span-2 space-y-4">
						{cartItems.map((item) => (
							<CartItem
								key={item._id}
								item={item}
								onRemove={() => removeFromCart(item.productId._id)}
								onUpdateQuantity={(newQuantity) =>
									updateCartProductQuantity(item.productId._id, newQuantity)
								}
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
							{couponDiscount > 0 && (
								<div className="flex justify-between text-green-600">
									<span>Discount ({couponDiscount * 100}%)</span>
									<span>-${discountAmount.toFixed(2)}</span>
								</div>
							)}
							<div className="flex justify-between font-bold text-dark-gray text-lg pt-4 border-t mt-4">
								<span>Total</span>
								<span>${finalTotal.toFixed(2)}</span>
							</div>
						</div>

						<div className="mt-6">
							<CouponField
								label="Have a coupon?"
								value={couponCode}
								onChange={(e) => setCouponCode(e.target.value)}
								onApply={handleApplyCoupon}
							/>
							<ErrorMessage error={couponError} />

							<div className="mt-6">
								<Button
									text={
										isCheckingOut ? "Placing Order..." : "Proceed to Checkout"
									}
									onClick={handleCheckout}
									disabled={isCheckingOut}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
