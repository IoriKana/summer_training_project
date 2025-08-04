import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { makeGet } from "../utils/makeRequest.js";

const HomePage = () => {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setIsLoading(true);
				const response = await makeGet("products");
				setProducts(response.data);
			} catch (err) {
				setError(err.message);
				console.error("Failed to fetch products:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProducts();
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen flex justify-center items-center bg-gray-100">
				<p>Loading products...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex justify-center items-center bg-red-100">
				<p className="text-red-600">Error: {error}</p>
			</div>
		);
	}

	return (
		<div className="bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue min-h-screen p-4 sm:p-8">
			<div className="container mx-auto">
				<h1 className="text-4xl sm:text-5xl font-bold text-white text-shadow-md mb-8 text-center font-heading">
					Products
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
					{products.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
