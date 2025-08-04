import React from "react";

const ProductImage = ({ image, alt }) => {
	return (
		<img
			src={image}
			alt={alt}
			className="my-6 rounded-lg shadow-md max-w-sm mx-auto"
		/>
	);
};

export default ProductImage;
