import React, { useState } from "react";

import { AuthContext } from "./AuthContext.js";

import { makePost } from "../utils/makeRequest.js";

export function AuthProvider({ children }) {
	const [authToken, setAuthToken] = useState(() =>
		localStorage.getItem("authToken")
	);

	const login = async (email, password) => {
		const data = await makePost("auth/login", { email, password });
		localStorage.setItem("authToken", data.token);
		setAuthToken(data.token);
	};

	const logout = () => {
		localStorage.removeItem("authToken");
		setAuthToken(null);
	};

	const value = { authToken, login, logout };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
