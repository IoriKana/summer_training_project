import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const OrderHistoryCard = ({ order }) => {
	const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
	const imagePreviews = order.items.slice(0, 10);

	return (
		<Link
			to={`/order/${order._id}`}
			className="block bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
		>
			<div className="grid grid-cols-2 md:grid-cols-4 items-start gap-4 text-left">
				<div>
					<p className="text-sm text-gray-500">Order ID</p>
					<p className="font-mono text-xs text-dark-gray truncate">
						{order._id}
					</p>
				</div>
				<div>
					<p className="text-sm text-gray-500">Date Placed</p>
					<p className="font-semibold text-dark-gray">
						{new Date(order.orderDate).toLocaleDateString()}
					</p>
				</div>
				<div>
					<p className="text-sm text-gray-500">Items</p>
					<p className="font-semibold text-dark-gray">{totalItems}</p>
				</div>
				<div className="md:text-right">
					<p className="text-sm text-gray-500">Total</p>
					<p className="text-2xl font-bold text-dark-pastel-purple">
						${order.totalCost.toFixed(2)}
					</p>
				</div>
			</div>

			{imagePreviews.length > 0 && (
				<div className="mt-4">
					<div className="flex items-center gap-2">
						{imagePreviews.map((item) => (
							<img
								key={item._id}
								src={item.productId.image}
								alt={item.productId.name}
								className="w-12 h-12 rounded-md object-cover bg-gray-200"
							/>
						))}
					</div>
				</div>
			)}

			<div className="mt-4 pt-4 border-t border-gray-300/50 flex justify-between items-center">
				<div className="flex items-center gap-2">
					<p className="text-sm text-gray-600">Status:</p>
					<StatusBadge status={order.shippingStatus} />
				</div>
			</div>
		</Link>
	);
};

export default OrderHistoryCard;
