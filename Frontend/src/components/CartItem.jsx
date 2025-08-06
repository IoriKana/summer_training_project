import React from "react";
import { Link } from "react-router-dom";

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
	const product = item.productId;
	if (!product) {
		return null;
	}

	const handleQuantityChange = (newQuantity) => {
		if (newQuantity >= 1 && newQuantity <= product.stock) {
			onUpdateQuantity(product._id, newQuantity);
		}
	};

	return (
		<div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl shadow-sm">
			<Link to={`/products/${product._id}`}>
				<img
					src={product.image}
					alt={product.name}
					className="w-20 h-20 rounded-lg object-cover"
				/>
			</Link>

			<div className="flex-grow">
				<Link to={`/products/${product._id}`} className="hover:underline">
					<h3 className="font-bold text-dark-gray">{product.name}</h3>
				</Link>
				<p className="text-sm text-gray-600">
					${product.price.toFixed(2)} each
				</p>
			</div>

			<div className="flex items-center gap-2 border border-gray-200 rounded-md p-1">
				<button
					onClick={() => handleQuantityChange(item.quantity - 1)}
					className="px-2 font-bold"
				>
					-
				</button>
				<span>{item.quantity}</span>
				<button
					onClick={() => handleQuantityChange(item.quantity + 1)}
					className="px-2 font-bold"
				>
					+
				</button>
			</div>

			<div className="w-24 text-right">
				<p className="font-bold text-dark-gray">
					${(product.price * item.quantity).toFixed(2)}
				</p>
			</div>

			<button
				onClick={() => onRemove(product._id)}
				className="text-gray-500 hover:text-red-500 font-bold text-xl"
			>
				&times;
			</button>
		</div>
	);
};

export default CartItem;
