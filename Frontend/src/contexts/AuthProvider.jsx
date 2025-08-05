import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";
import { makePost, makeGet } from "../utils/makeRequest.js";

export function AuthProvider({ children }) {
	const [account, setAccount] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const authToken = account ? "session_active" : null;

	useEffect(() => {
		const checkUserSession = async () => {
			try {
				const response = await makeGet("auth/me");
				if (response.data && response.data.account) {
					setAccount(response.data.account);
				}
			} catch (error) {
				console.log("No active session found.", error);
				setAccount(null);
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
		}
	};

	const logout = async () => {
		try {
			await makeGet("auth/logout");
		} finally {
			setAccount(null);
		}
	};

	const updateAuthAccount = (newAccountData) => {
		setAccount(newAccountData);
	};

	const value = {
		account,
		authToken,
		login,
		logout,
		isLoading,
		updateAuthAccount,
	};

	return (
		<AuthContext.Provider value={value}>
			{!isLoading && children}
		</AuthContext.Provider>
	);
}
