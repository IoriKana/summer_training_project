const API_BASE_URL = "http://localhost:3000/api";

const makeRequest = async (endpoint, method = "GET", body = null) => {
	let url = `${API_BASE_URL}/${endpoint}`;

	const options = {
		method,
		credentials: "include",
		headers: {},
	};

	if (body) {
		if (body instanceof FormData) {
			options.body = body;
		} else {
			options.headers["Content-Type"] = "application/json";
			options.body = JSON.stringify(body);
		}
	}

	try {
		const response = await fetch(url, options);

		const contentType = response.headers.get("content-type");
		if (!response.ok) {
			let errorData;
			if (contentType && contentType.indexOf("application/json") !== -1) {
				errorData = await response.json();
			}
			throw new Error(errorData?.message || response.statusText);
		}

		if (contentType && contentType.indexOf("application/json") !== -1) {
			return response.json();
		} else {
			return;
		}
	} catch (error) {
		console.error(`${method} request to ${url} failed:`, error);
		throw error;
	}
};

export const makeGet = (endpoint) => makeRequest(endpoint, "GET");
export const makePost = (endpoint, body) => makeRequest(endpoint, "POST", body);
export const makePut = (endpoint, body) => makeRequest(endpoint, "PUT", body);
export const makePatch = (endpoint, body) =>
	makeRequest(endpoint, "PATCH", body);
