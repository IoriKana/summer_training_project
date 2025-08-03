import React from "react";

const Button = ({ text, disabled, ...rest }) => {
	return (
		<button
			{...rest}
			disabled={disabled}
			className="w-full bg-pastel-purple text-white font-body font-bold py-3 px-4 rounded-lg shadow-md hover:scale-105 active:scale-100 transition-transform disabled:bg-gray-400 disabled:scale-100"
		>
			{text}
		</button>
	);
};

export default Button;
