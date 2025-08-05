import React from "react";
import EmailField from "../components/EmailField";
import PasswordField from "../components/PasswordField";
import UsernameField from "../components/UsernameField";
import CountrySelect from "../components/CountrySelect";
import CitySelect from "../components/CitySelect";
import BuildingField from "../components/BuildingField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makePost } from "../utils/makeRequest";
import { Country } from "country-state-city";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth.js";

const SignUpPage = () => {
	const [userName, setUsername] = useState(""); // Corrected from `username` to `userName` for consistency
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [countryCode, setCountryCode] = useState(""); // Initialize as empty string
	const [city, setCity] = useState(""); // Initialize as empty string
	const [building, setBuilding] = useState(""); // Initialize as empty string
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const { login } = useAuth();

	const navigate = useNavigate();

	const handleCountryChange = (e) => {
		const newCountryCode = e.target.value;
		setCountryCode(newCountryCode);
		setCity("");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		setError(null);

		if (password !== confirmPassword) {
			setError("Passwords do not match. Please try again.");
			setIsLoading(false);
			return;
		}

		try {
			const countryName = Country.getCountryByCode(countryCode)?.name;

			// eslint-disable-next-line no-unused-vars
			const response = await makePost("auth/signup", {
				userName,
				email,
				password,
				country: countryName,
				city,
				building,
			});

			await login(email, password);

			navigate("/set-profile-image");
		} catch (err) {
			setError(err.message || "An unknown error occurred.");
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
				<UsernameField
					label="Username"
					value={userName}
					onChange={(e) => setUsername(e.target.value)}
				/>
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
				<PasswordField
					label="Confirm Password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
				<CountrySelect
					label="Country"
					value={countryCode}
					onChange={handleCountryChange}
				/>
				<CitySelect
					label="City"
					value={city}
					onChange={(e) => setCity(e.target.value)}
					countryCode={countryCode}
				/>
				<BuildingField
					label="Building No."
					value={building}
					onChange={(e) => setBuilding(e.target.value)}
				/>

				<ErrorMessage error={error} />

				<Button
					type="submit"
					disabled={isLoading}
					text={isLoading ? "Creating Account..." : "Sign Up"}
				/>
			</form>
		</div>
	);
};

export default SignUpPage;
