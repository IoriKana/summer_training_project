import React, { useState, useEffect } from "react";
import {
	useParams,
	Navigate,
	useNavigate,
	useLocation,
} from "react-router-dom";
import { makeGet } from "../utils/makeRequest";
import ProductName from "../components/ProductName";
import ProductPrice from "../components/ProductPrice";
import ProductImage from "../components/ProductImage";
import ProductDescription from "../components/ProductDescription";
import ProductReview from "../components/ProductReview";
import Button from "../components/Button";
import QuantitySelect from "../components/QuantitySelect";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const ProductPage = () => {
	const { productId } = useParams();
	const [product, setProduct] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [reviews, setReviews] = useState([]);
	const { authToken } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { addToCart } = useCart();
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		const getProduct = async () => {
			setIsLoading(true);
			setError(null);
			setSuccessMessage("");
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

	const incrementQuantity = () => {
		if (quantity < product.stock) {
			setQuantity((q) => q + 1);
		}
	};
	const decrementQuantity = () => {
		if (quantity > 1) {
			setQuantity((q) => q - 1);
		}
	};

	const handleAddToCart = (e) => {
		if (authToken) {
			addToCart(product, quantity);
			setSuccessMessage(`${quantity} of ${product.name} added to cart!`);
			e.target.disabled = true;
			setTimeout(() => {
				e.target.disabled = false;
				setSuccessMessage("");
			}, 3000);
		} else {
			navigate("/login", { state: { from: location } });
		}
	};

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
				<div className="lg:flex lg:gap-12">
					<div className="lg:w-1/2">
						<ProductImage image={product.image} alt={product.name} />
					</div>
					<div className="lg:w-1/2 mt-8 lg:mt-0 flex flex-col justify-center">
						<div className="text-center lg:text-left">
							<ProductName name={product.name} />
							<ProductPrice price={product.price} />
						</div>

						<div className="mt-6 space-y-2">
							<div className="flex items-center gap-2 justify-center lg:justify-start">
								{product.stock > 0 ? (
									<>
										<span className="w-3 h-3 bg-green-500 rounded-full"></span>
										<p className="text-sm font-medium text-gray-700">
											{product.stock} available
										</p>
									</>
								) : (
									<p className="text-sm font-medium text-red-600">
										Out of stock
									</p>
								)}
							</div>

							<div className="flex items-center gap-4">
								<QuantitySelect
									product={product}
									quantity={quantity}
									incrementQuantity={incrementQuantity}
									decrementQuantity={decrementQuantity}
								/>
								<div className="flex-1">
									<Button
										text="Add to cart"
										onClick={(e) => {
											handleAddToCart(e);
										}}
										disabled={product.stock === 0}
									/>
								</div>
							</div>

							<div className="h-6 text-center">
								{successMessage && (
									<p className="text-green-600 font-semibold">
										{successMessage}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="mt-12 pt-8 border-t border-gray-200">
					<ProductDescription desc={product.description} />
				</div>
				<div className="mt-8 pt-6 border-t border-gray-200">
					<h3 className="text-xl font-bold text-dark-gray mb-2">Reviews</h3>
					{reviews.length > 0 ? (
						reviews.map((review) => (
							<ProductReview key={review._id} review={review} />
						))
					) : (
						<p className="text-gray-600">No reviews for this product yet.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductPage;
