import React from "react";
import ProfileImageSmall from "./ProfileImageSmall";

const formStars = (numOfStars) => {
	const filledStars = "★".repeat(numOfStars);
	const emptyStars = "☆".repeat(5 - numOfStars);
	return filledStars + emptyStars;
};

const ProductReview = ({ review }) => {
	const name = review.userID?.name || "Anonymous";
	const imageUrl = review.userID?.account?.profile_image_url;

	return (
		<div className="flex items-start gap-4 p-4 border-t border-gray-200">
			<ProfileImageSmall image={imageUrl} />
			<div className="flex-1">
				<div className="flex items-center justify-between">
					<h3 className="font-bold text-dark-gray">{name}</h3>
					<p className="text-lg text-yellow-500">{formStars(review.stars)}</p>
				</div>
				<p className="text-gray-700 mt-1">{review.review}</p>
			</div>
		</div>
	);
};

export default ProductReview;
