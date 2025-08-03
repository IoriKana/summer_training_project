export const makePost = async (route, data) => {
	try {
		const response = await fetch(`http://localhost:3000/api/${route}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
			body: JSON.stringify(data),
		});

		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(
				responseData.message || "An error occurred during the POST request."
			);
		}

		return responseData;
	} catch (error) {
		console.error(`POST request to /api/${route} failed:`, error);
		throw error;
	}
};

export const makeGet = async (route, params) => {
	const baseURL = `http://localhost:3000/api/${route}`;
	let url = baseURL;

	if (params) {
		const queryParams = new URLSearchParams(params).toString();
		if (queryParams) {
			url += `?${queryParams}`;
		}
	}

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		});

		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(
				responseData.message || "An error occurred during the GET request."
			);
		}

		return responseData;
	} catch (error) {
		console.error(`GET request to ${url} failed:`, error);
		throw error;
	}
};
