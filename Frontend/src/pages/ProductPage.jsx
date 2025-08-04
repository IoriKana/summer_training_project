import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { makeGet } from "../utils/makeRequest";
import ProductName from "../components/ProductName";
import ProductPrice from "../components/ProductPrice";
import ProductImage from "../components/ProductImage";
import ProductDescription from "../components/ProductDescription";
import ProductReview from "../components/ProductReview";

const ProductPage = () => {
	const { productId } = useParams();
	const [product, setProduct] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [reviews, setReviews] = useState([]);

	useEffect(() => {
		const getProduct = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await makeGet(`products/${productId}`);
				setProduct(response.data.ProductInfo);
				setReviews(response.data.Reviews);
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
			<div className="container mx-auto bg-white/35 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
				<ProductName name={product.name} />
				<ProductPrice price={product.price} />
				<ProductImage image={product.image} alt={product.name} />
				<ProductDescription desc={product.description} />
				<div className="mt-10">
					<h3 className="font-bold">Reviews</h3>
					{reviews.map((review) => (
						<ProductReview key={review._id} review={review} />
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductPage;
