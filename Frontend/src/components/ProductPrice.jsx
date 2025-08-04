import React from "react";

const ProductPrice = ({ price }) => {
	return (
		<p className="text-3xl font-extrabold text-pastel-purple mt-2">
			${price.toFixed(2)}
		</p>
	);
};

export default ProductPrice;
