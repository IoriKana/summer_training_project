import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmailField from "../components/EmailField.jsx";
import PasswordField from "../components/PasswordField.jsx";
import CodeField from "../components/CodeField.jsx";
import Button from "../components/Button.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { makePost } from "../utils/makeRequest.js";

const ResetPasswordPage = () => {
	const { email } = useParams();
	const navigate = useNavigate();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [code, setCode] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccessMessage("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsLoading(true);
		try {
			await makePost(`auth/reset-password/${email}`, {
				code,
				newpassword: password,
				confirmpassword: confirmPassword,
			});

			setSuccessMessage("Password changed successfully!");
			setTimeout(() => navigate("/login"), 2000);
		} catch (err) {
			setError(
				err?.response?.data?.message ||
					err?.message ||
					"An error occurred while resetting your password."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue flex items-center justify-center min-h-screen p-4 font-body">
			<form
				onSubmit={handleSubmit}
				className="bg-white/90 p-8 sm:p-12 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-sm"
			>
				<div className="text-center mb-10">
					<h1 className="font-heading text-4xl font-bold text-dark-gray">
						Reset Password
					</h1>
					<p className="text-gray-500 mt-2">
						Enter your new password and the code from your email
					</p>
				</div>

				<PasswordField
					label="New Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<PasswordField
					label="Confirm New Password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>

				<CodeField
					label="Reset Code"
					value={code}
					onChange={(e) => setCode(e.target.value)}
				/>

				<ErrorMessage error={error} />
				{successMessage && (
					<p className="text-green-600 font-semibold text-center mt-4">
						{successMessage}
					</p>
				)}

				<div className="mt-8">
					<Button
						type="submit"
						disabled={isLoading}
						text={isLoading ? "Resetting Password..." : "Reset Password"}
					/>
				</div>
			</form>
		</div>
	);
};

export default ResetPasswordPage;
