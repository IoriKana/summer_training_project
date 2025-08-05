import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";
import { makePost, makeGet } from "../utils/makeRequest.js";

export function AuthProvider({ children }) {
	const [account, setAccount] = useState(null);
	const [authToken, setAuthToken] = useState(null);
	const [isLoading, setIsLoading] = useState(true); // This state is correct

	useEffect(() => {
		const checkUserSession = async () => {
			try {
				const response = await makeGet("auth/me");
				if (response.data && response.data.account) {
					setAccount(response.data.account);
					setAuthToken("session_active");
				}
			} catch (error) {
				console.log("No active session found.", error);
				setAccount(null);
				setAuthToken(null);
			} finally {
				setIsLoading(false);
			}
		};
		checkUserSession();
	}, []);

	const login = async (email, password) => {
		const response = await makePost("auth/login", { email, password });
		if (response.data && response.data.account) {
			setAccount(response.data.account);
			setAuthToken(response.data.token);
		} else {
			throw new Error("Login response did not contain account data.");
		}
	};

	const logout = async () => {
		try {
			await makePost("auth/logout", null);
		} finally {
			setAccount(null);
			setAuthToken(null);
		}
	};

	const value = { account, authToken, login, logout, isLoading };

	return (
		<AuthContext.Provider value={value}>
			{/* Render nothing until the initial session check is complete */}
			{isLoading ? null : children}
		</AuthContext.Provider>
	);
}
