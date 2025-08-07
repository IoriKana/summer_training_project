import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import EmailField from "../components/EmailField";
import { useNavigate } from "react-router-dom";
import { makePost } from "../utils/makeRequest";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async () => {
		const response = await makePost("auth/forgot-password", { email: email });
		navigate(`/reset-password/${email}`, { replace: true });
	};
	return (
		<div className="bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue flex items-center justify-center min-h-screen p-4 font-body">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				className="bg-white/90 p-8 sm:p-12 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-sm"
			>
				<div className="text-center mb-10">
					<h1 className="font-heading text-4xl font-bold text-dark-gray">
						Forgot Password
					</h1>
					<p className="text-gray-500 mt-2">Please Enter Your Email Address</p>
				</div>

				<EmailField
					label="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<Button type="submit" text="reset password" disabled={false} />
			</form>
		</div>
	);
};

export default ForgotPasswordPage;
