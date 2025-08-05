import React from "react";

const ErrorMessage = ({ error }) => {
	if (!error) {
		return null;
	}

	return (
		<div className="bg-pink-100 text-red-700 font-medium p-3 mb-6 rounded-lg text-center">
			<p>{error}</p>
		</div>
	);
};

export default ErrorMessage;
