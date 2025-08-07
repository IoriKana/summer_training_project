const SmallButton = ({ text, disabled, onClick, ...rest }) => {
	return (
		<button
			{...rest}
			onClick={onClick}
			disabled={disabled}
			className="px-5 py-2 bg-pastel-purple text-white font-body font-bold rounded-lg shadow-md hover:scale-105 active:scale-100 transition-transform disabled:bg-gray-400 disabled:scale-100 cursor-pointer"
		>
			{text}
		</button>
	);
};

export default SmallButton;
