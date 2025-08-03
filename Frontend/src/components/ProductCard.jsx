import React from "react";

const DEFAULT_PRODUCT_IMAGE_URL =
	"https://media.istockphoto.com/id/922962354/vector/no-image-available-sign.jpg?s=612x612&w=0&k=20&c=xbGzQiL_UIMFDUZte1U0end0p3E8iwocIOGt_swlywE=";

const getTransformedImageUrl = (publicId) => {
	const transformations = "w_400,h_300,c_fill,g_auto";

	if (!publicId) {
		return DEFAULT_PRODUCT_IMAGE_URL;
	}

	return `https://res.cloudinary.com/dqbl32cmw/image/upload/${transformations}/${publicId}`;
};

const ProductCard = ({ product }) => {
	const imageUrl = getTransformedImageUrl(product.cloudinary_id);

	return (
		<div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
			<div className="w-full h-48 bg-gray-200">
				<img
					src={imageUrl}
					alt={product.name}
					className="w-full h-full object-cover"
					width="400"
					height="300"
				/>
			</div>

			<div className="p-5">
				<p className="font-bold text-xl text-pastel-purple mb-2">
					${product.price.toFixed(2)}
				</p>

				<h3 className="text-lg font-heading font-bold text-dark-gray truncate">
					{product.name}
				</h3>

				<p className="text-gray-600 text-sm mt-1 line-clamp-2">
					{product.description}
				</p>
			</div>
		</div>
	);
};

export default ProductCard;
