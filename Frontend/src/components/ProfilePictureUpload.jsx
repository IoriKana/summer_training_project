import React, { useState } from "react";
import { makePut } from "../utils/makeRequest";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import { useNavigate } from "react-router-dom";

const ProfilePictureUpload = ({ refresh = true, redirectTo = null }) => {
	const [file, setFile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const navigate = useNavigate();

	const { updateAuthAccount } = useAuth();

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
			setError(null);
			setSuccessMessage(null);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file) {
			setError("Please select a file to upload.");
			return;
		}
		setIsLoading(true);
		setError(null);
		setSuccessMessage(null);

		const formData = new FormData();
		formData.append("image", file);

		try {
			const response = await makePut("accounts/profile/image", formData);
			if (response.data && response.data.account) {
				updateAuthAccount(response.data.account);
			}
			setSuccessMessage("Success!");
			if (refresh) {
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			} else if (redirectTo) {
				setTimeout(() => {
					navigate(redirectTo);
				}, 1500);
			}
		} catch (err) {
			setError(err.message || "An unknown error occurred.");
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full space-y-4 mt-6">
			<div>
				<label htmlFor="file-upload" className="sr-only">
					Choose a file
				</label>
				<input
					id="file-upload"
					type="file"
					accept="image/png, image/jpeg, image/jpg"
					onChange={handleFileChange}
					className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pastel-purple/20 file:text-pastel-purple hover:file:bg-pastel-purple/30"
				/>
			</div>

			<ErrorMessage error={error} />
			{successMessage && (
				<p className="text-center text-green-600 font-medium">
					{successMessage}
				</p>
			)}

			{file && (
				<Button
					type="submit"
					disabled={isLoading}
					text={isLoading ? "Uploading..." : "Save New Picture"}
				/>
			)}
		</form>
	);
};

export default ProfilePictureUpload;
