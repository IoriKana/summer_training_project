import React from "react";
import EmailField from "../components/EmailField.jsx";
import PasswordField from "../components/PasswordField.jsx";
import Button from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

const LoginPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const { login } = useAuth();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		setError(null);
		try {
			await login(email, password);
			navigate("/home");
		} catch (err) {
			setError(err.message);
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
						Login
					</h1>
					<p className="text-gray-500 mt-2">Please sign in to your account</p>
				</div>

				<EmailField
					label="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<PasswordField
					label="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				{error && (
					<div className="bg-pink-100 text-red-700 font-medium p-3 mb-6 rounded-lg text-center">
						<p>{error}</p>
					</div>
				)}

				<div className="mt-8">
					<Button
						type="submit"
						disabled={isLoading}
						text={isLoading ? "Signing In..." : "Sign In"}
					/>
				</div>

				<div className="mt-8 flex justify-between text-center items-center">
					<h5>forgot password?</h5>
					<h5>don't have an account?</h5>
				</div>
			</form>
		</div>
	);
};

export default LoginPage;
