import React from "react";

const EmailField = ({ label, value, onChange }) => {
	return (
		<div className="mb-6">
			<label htmlFor="email" className="block text-gray-600 font-medium mb-2">
				{label}
			</label>
			<input
				type="email"
				id="email"
				name="email"
				value={value}
				onChange={onChange}
				placeholder="you@example.com"
				className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pastel-purple transition-shadow"
			/>
		</div>
	);
};

export default EmailField;
