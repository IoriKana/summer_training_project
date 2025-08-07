exports.respond = (res, status, message = null, data = null) => {
	const length = data?.length || null;
	res.status(status).json({
		message: message,
		length: length,
		data: data,
	});
};
exports.msToTime = (ms) => {
	let seconds = (ms / 1000).toFixed(0);
	let minutes = (ms / (1000 * 60)).toFixed(0);
	let hours = (ms / (1000 * 60 * 60)).toFixed(0);
	let days = (ms / (1000 * 60 * 60 * 24)).toFixed(0);
	if (seconds < 60) return seconds + " second";
	else if (minutes < 60) return minutes + " minute(s)";
	else if (hours < 24) return hours + " hour(s)";
	else return days + " Days";
};
