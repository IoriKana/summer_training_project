import React from "react";

const CodeField = ({ label, value, onChange }) => {
	return (
		<div className="mb-6">
			<label htmlFor="code" className="block text-gray-600 font-medium mb-2">
				{label}
			</label>
			<input
				type="text"
				id="code"
				name="code"
				value={value}
				onChange={onChange}
				placeholder="123456"
				className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pastel-purple transition-shadow"
			/>
		</div>
	);
};

export default CodeField;
