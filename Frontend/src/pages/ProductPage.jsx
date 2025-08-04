import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { makeGet } from "../utils/makeRequest";
import ProductName from "../components/ProductName";

const ProductPage = () => {
	const { productId } = useParams();
	const [product, setProduct] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const getProduct = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await makeGet(`products/${productId}`);
				setProduct(response.data.ProductInfo);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};
		getProduct();
	}, [productId]);

	if (isLoading) {
		return <div className="text-center p-10">Loading...</div>;
	}
	if (error) {
		return <div className="text-center p-10 text-red-500">Error: {error}</div>;
	}
	if (!product) {
		return <Navigate to="/not-found" replace />;
	}

	return (
		<div className="bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue min-h-screen p-8">
			<div className="container mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
				<ProductName name={product.name} />
				<p className="text-2xl text-pastel-purple mt-2">
					{product.price.toFixed(2)}
				</p>
				<img
					src={product.image}
					alt={product.name}
					className="my-6 rounded-lg shadow-md max-w-sm mx-auto"
				/>
				<p className="text-gray-700">{product.description}</p>
			</div>
		</div>
	);
};

export default ProductPage;
