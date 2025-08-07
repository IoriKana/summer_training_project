import React, { useState, useEffect, useCallback } from "react";
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
import CreateReviewForm from "../components/CreateReviewForm";
import SmallButton from "../components/SmallButton"; // <-- Import the new component

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

	const [canReview, setCanReview] = useState(false);
	const [isCheckingReview, setIsCheckingReview] = useState(true);
	const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);

	const getProductAndReviews = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await makeGet(`products/${productId}`);
			setProduct(response.data.ProductInfo);
			setReviews(response.data.Reviews);
		} catch (err) {
			setError(err.message || "Failed to load product.");
		} finally {
			setIsLoading(false);
		}
	}, [productId]);

	useEffect(() => {
		getProductAndReviews();
	}, [getProductAndReviews]);

	useEffect(() => {
		const checkReviewStatus = async () => {
			if (authToken && product) {
				setIsCheckingReview(true);
				try {
					const res = await makeGet(`review/check/${product._id}`);
					setCanReview(res.data.canReview);
				} catch (error) {
					setCanReview(false);
				} finally {
					setIsCheckingReview(false);
				}
			} else {
				setCanReview(false);
				setIsCheckingReview(false);
			}
		};

		if (!isLoading) {
			checkReviewStatus();
		}
	}, [authToken, product, isLoading]);

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
				if (e.target) e.target.disabled = false;
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
			<div className="container mx-auto bg-white/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
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
										onClick={handleAddToCart}
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
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-xl font-bold text-dark-gray">Reviews</h3>
						{canReview && !isReviewFormVisible && (
							<SmallButton
								text="Write a Review"
								onClick={() => setIsReviewFormVisible(true)}
							/>
						)}
					</div>

					{isReviewFormVisible && (
						<div className="mb-8">
							<CreateReviewForm
								productId={product._id}
								onReviewSubmit={() => {
									setIsReviewFormVisible(false);
									getProductAndReviews();
								}}
							/>
						</div>
					)}

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
