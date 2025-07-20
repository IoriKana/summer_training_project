exports.respond = (res, status, message = null, data = null, error = null) => {
	const length = data?.length || null;
	res.status(status).json({
		message: message,
		length: length,
		data: data,
		error: error,
	});
};
