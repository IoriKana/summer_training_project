import React from "react";

const PasswordField = ({ label, value, onChange }) => {
	return (
		<div className="mb-6">
			<label
				htmlFor="password"
				// Label style simplified for a cleaner look
				className="block text-gray-600 font-medium mb-2"
			>
				{label}
			</label>
			<input
				type="password"
				id="password"
				name="password"
				value={value}
				onChange={onChange}
				placeholder="••••••••"
				className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pastel-purple transition-shadow"
			/>
		</div>
	);
};

export default PasswordField;
