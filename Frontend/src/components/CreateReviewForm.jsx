import React, { useState } from "react";
import { makePost } from "../utils/makeRequest";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

const StarRating = ({ rating, setRating }) => {
	return (
		<div className="flex justify-center text-4xl">
			{[1, 2, 3, 4, 5].map((star) => (
				<span
					key={star}
					className={`cursor-pointer transition-colors ${
						star <= rating
							? "text-yellow-400"
							: "text-gray-300 hover:text-yellow-300"
					}`}
					onClick={() => setRating(star)}
				>
					★
				</span>
			))}
		</div>
	);
};

const CreateReviewForm = ({ productId, onReviewSubmit }) => {
	const [stars, setStars] = useState(0);
	const [review, setReview] = useState("");
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (stars === 0) {
			setError("Please select a star rating.");
			return;
		}
		if (review.trim() === "") {
			setError("Please write a review.");
			return;
		}

		setIsLoading(true);
		setError(null);
		try {
			await makePost("review", { productId, stars, review });
			setSuccess(true);
			setTimeout(() => {
				onReviewSubmit();
			}, 1500);
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
		}
	};

	if (success) {
		return (
			<div className="text-center bg-green-100 text-green-800 p-4 rounded-lg">
				<p className="font-semibold">
					Thank you! Your review has been submitted.
				</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white/60 p-6 rounded-xl shadow-md space-y-4"
		>
			<h3 className="text-xl font-bold text-dark-gray text-center">
				Write a Review
			</h3>
			<StarRating rating={stars} setRating={setStars} />
			<textarea
				value={review}
				onChange={(e) => setReview(e.target.value)}
				placeholder="Share your thoughts on the product..."
				className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pastel-purple"
				rows="4"
			/>
			<ErrorMessage error={error} />
			<Button
				type="submit"
				disabled={isLoading}
				text={isLoading ? "Submitting..." : "Submit Review"}
			/>
		</form>
	);
};

export default CreateReviewForm;
