import React from "react";

const QuantitySelect = ({
	product,
	quantity,
	incrementQuantity,
	decrementQuantity,
}) => {
	return (
		<div className="flex items-center border border-gray-300 rounded-lg">
			<button
				onClick={decrementQuantity}
				className="px-3 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg"
				disabled={product.stock === 0}
			>
				-
			</button>
			<span className="px-4 py-2 font-bold text-dark-gray">{quantity}</span>
			<button
				onClick={incrementQuantity}
				className="px-3 py-2 text-lg font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg"
				disabled={product.stock === 0}
			>
				+
			</button>
		</div>
	);
};

export default QuantitySelect;
