import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeGet } from "../utils/makeRequest";
import OrderHistoryCard from "../components/OrderHistoryCard";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";

const OrderHistoryPage = () => {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchOrders = async () => {
			setIsLoading(true);
			try {
				const response = await makeGet("orders");
				const sortedOrders = response.data.sort(
					(a, b) => new Date(b.orderDate) - new Date(a.orderDate)
				);
				setOrders(sortedOrders);
			} catch (err) {
				setError(err.message || "Failed to fetch order history.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrders();
	}, []);

	if (isLoading) {
		return (
			<div className="text-center p-10 font-bold">Loading Order History...</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-[60vh] flex flex-col justify-center items-center">
				<ErrorMessage error={error} />
			</div>
		);
	}

	return (
		<div className="bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue min-h-screen p-4 sm:p-8">
			<div className="container mx-auto max-w-4xl">
				<h1 className="text-4xl font-bold text-white text-shadow-md mb-8 font-heading">
					Order History
				</h1>

				{orders.length > 0 ? (
					<div className="space-y-6">
						{orders.map((order) => (
							<OrderHistoryCard key={order._id} order={order} />
						))}
					</div>
				) : (
					<div className="text-center bg-white/70 backdrop-blur-lg rounded-2xl p-10">
						<h2 className="text-2xl font-bold text-dark-gray mb-4">
							No Orders Yet
						</h2>
						<p className="text-gray-600 mb-6">
							You haven't placed any orders. Let's change that!
						</p>
						<Link to="/">
							<Button text="Start Shopping" />
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default OrderHistoryPage;
