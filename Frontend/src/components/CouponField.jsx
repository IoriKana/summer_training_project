import React from "react";

const CouponField = ({
	label,
	value,
	onChange,
	onApply,
	isLoading = false,
}) => {
	return (
		<div className="space-y-2">
			<label htmlFor="coupon-input" className="block text-gray-600 font-medium">
				{label}
			</label>
			<div className="flex items-center gap-2">
				<input
					type="text"
					id="coupon-input"
					name="coupon"
					value={value}
					onChange={onChange}
					placeholder="Enter coupon code"
					className="flex-grow w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pastel-purple transition-shadow"
				/>
				<button
					type="button"
					onClick={onApply}
					disabled={isLoading || !value}
					className="px-5 py-3 bg-pastel-purple text-white font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{isLoading ? "..." : "Apply"}
				</button>
			</div>
		</div>
	);
};

export default CouponField;
