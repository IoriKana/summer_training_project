import React from "react";

const ProductDescription = ({ desc }) => {
	return (
		<div className="mt-6">
			<h3 className="text-xl font-bold text-dark-gray mb-2">Description</h3>
			<p className="text-gray-700 text-base leading-relaxed">{desc}</p>
		</div>
	);
};

export default ProductDescription;
