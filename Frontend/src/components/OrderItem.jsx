import React from "react";
import { Link } from "react-router-dom";

const OrderItem = ({ item }) => {
	const { productId, quantity, price } = item;

	if (!productId) {
		return null;
	}

	return (
		<div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl shadow-sm">
			<Link to={`/products/${productId._id}`}>
				<img
					src={productId.image}
					alt={productId.name}
					className="w-24 h-24 rounded-lg object-cover bg-gray-200"
				/>
			</Link>

			<div className="flex-grow">
				<Link
					to={`/products/${productId._id}`}
					className="font-bold text-dark-gray hover:underline"
				>
					{productId.name}
				</Link>
				<p className="text-sm text-gray-600">${price.toFixed(2)} each</p>
			</div>

			<div className="flex items-center gap-8">
				<div className="text-center">
					<p className="text-sm text-gray-600">Quantity</p>
					<p className="font-bold text-lg text-dark-gray">{quantity}</p>
				</div>

				<div className="w-28 text-right">
					<p className="text-lg font-bold text-dark-gray">
						${(price * quantity).toFixed(2)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default OrderItem;
