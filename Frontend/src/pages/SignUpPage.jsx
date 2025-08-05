import React from "react";
import EmailField from "../components/EmailField";
import PasswordField from "../components/PasswordField";
import UsernameField from "../components/UsernameField";
import CountrySelect from "../components/CountrySelect";
import CitySelect from "../components/CitySelect";
import BuildingField from "../components/BuildingField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import makeRequest from "../utils/makeRequest";
import { Country } from "country-state-city";

const SignUpPage = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [country, setCountry] = useState();
	const [city, setCity] = useState();
	const [building, setBuilding] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		setError(null);
		try {
			if (password != confirmPassword) {
				alert("password does not match");
				setError(true);
				return;
			}
			const response = await makeRequest("/auth/signup", "POST", {
				userName: username,
				email,
				password,
				country,
				city,
				building,
			});
		} catch (error) {
		} finally {
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
					value={username}
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
					value={country}
					onChange={(e) => setCountry(e.target.value)}
				/>
				<BuildingField
					label="Building No."
					value={building}
					onChange={(e) => setBuilding(e.target.value)}
				/>
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
