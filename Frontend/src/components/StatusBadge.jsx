import React from "react";

const StatusBadge = ({ status }) => {
	const statusStyles = {
		// Shipping Statuses
		Pending: "bg-yellow-100 text-yellow-800",
		Shipped: "bg-blue-100 text-blue-800",
		Delivered: "bg-green-100 text-green-800",
		// Payment Statuses (and general)
		Paid: "bg-green-100 text-green-800",
		Cancelled: "bg-red-100 text-red-800",
		Canceled: "bg-red-100 text-red-800",
	};

	const style = statusStyles[status] || "bg-gray-100 text-gray-800";

	return (
		<span className={`px-3 py-1 text-sm font-medium rounded-full ${style}`}>
			{status}
		</span>
	);
};

export default StatusBadge;
