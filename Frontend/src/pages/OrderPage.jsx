import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { makeGet } from "../utils/makeRequest";
import StatusBadge from "../components/StatusBadge";
import OrderItem from "../components/OrderItem";
import ErrorMessage from "../components/ErrorMessage";

const OrderPage = () => {
	const { orderId } = useParams();
	const [order, setOrder] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchOrder = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await makeGet(`orders/${orderId}`);
				setOrder(response.data);
			} catch (err) {
				setError(err.message || "Failed to fetch order details.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrder();
	}, [orderId]);

	if (isLoading) {
		return (
			<div className="text-center p-10 font-bold">Loading Order Details...</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-[60vh] flex flex-col justify-center items-center">
				<ErrorMessage error={error} />
			</div>
		);
	}

	if (!order) {
		return null;
	}

	return (
		<div className="bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue min-h-screen p-4 sm:p-8">
			<div className="container mx-auto max-w-4xl">
				<div className="mb-6">
					<Link
						to="/orders"
						className="text-white hover:text-gray-200 font-semibold"
					>
						&larr; Back to Order History
					</Link>
				</div>

				<div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8">
					<div className="flex justify-between items-start border-b border-gray-300 pb-5 mb-5">
						<div>
							<h1 className="text-3xl font-bold text-dark-gray">
								Order Details
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								Order ID: {order._id}
							</p>
						</div>
						<div className="text-right">
							<p className="text-gray-800 font-semibold">
								Order Placed:{" "}
								<span className="font-normal text-gray-600">
									{new Date(order.orderDate).toLocaleDateString()}
								</span>
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
						<div>
							<h3 className="font-semibold text-gray-700 mb-2">
								Shipping Status
							</h3>
							<StatusBadge status={order.shippingStatus} />
						</div>
						<div>
							<h3 className="font-semibold text-gray-700 mb-2">
								Payment Status
							</h3>
							<StatusBadge status={order.paymentStatus} />
						</div>
						<div>
							<h3 className="font-semibold text-gray-700 mb-2">Order Total</h3>
							<p className="text-3xl font-bold text-dark-pastel-purple">
								${order.totalCost.toFixed(2)}
							</p>
						</div>
					</div>

					<div className="mt-6 pt-6 border-t border-gray-300">
						<h2 className="text-xl font-bold text-dark-gray mb-4">
							Items Ordered
						</h2>
						<div className="space-y-4">
							{order.items.map((item) => (
								<OrderItem key={item._id} item={item} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderPage;
