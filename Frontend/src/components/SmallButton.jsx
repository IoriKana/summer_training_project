const SmallButton = ({ text, disabled, onClick, ...rest }) => {
	return (
		<button
			{...rest}
			onClick={onClick}
			disabled={disabled}
			className="w-20 h-10 bg-pastel-purple text-white font-body font-bold py-3 px-4 rounded-lg shadow-md hover:scale-105 active:scale-100 transition-transform disabled:bg-gray-400 disabled:scale-100 cursor-pointer"
		>
			{text}
		</button>
	);
};

export default SmallButton;
