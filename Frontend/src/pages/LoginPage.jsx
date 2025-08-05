import React from "react";
import EmailField from "../components/EmailField.jsx";
import PasswordField from "../components/PasswordField.jsx";
import Button from "../components/Button.jsx";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import ErrorMessage from "../components/ErrorMessage.jsx";

const LoginPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const { login } = useAuth();
	const location = useLocation();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		setError(null);
		try {
			await login(email, password);
			const fromPath = location.state?.from?.pathname || "/";
			navigate(fromPath, { replace: true });
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

				<ErrorMessage error={error} />

				<div className="mt-8">
					<Button
						type="submit"
						disabled={isLoading}
						text={isLoading ? "Signing In..." : "Sign In"}
					/>
				</div>

				<div className="mt-8 flex justify-between text-center items-center">
					<Link to="/signup">
						<h5 className="text-dark-pastel-purple">don't have an account?</h5>
					</Link>
					<Link to="/forgot-password">
						<h5 className="text-dark-pastel-purple">forgot password?</h5>
					</Link>
				</div>
			</form>
		</div>
	);
};

export default LoginPage;
