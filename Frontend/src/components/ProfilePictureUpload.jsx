import React, { useState, useEffect } from "react";
import { makePut } from "../utils/makeRequest"; // We will create this helper
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import ProfileImageSmall from "./ProfileImageSmall";
import { useNavigate } from "react-router-dom";

const ProfilePictureUpload = () => {
	const [file, setFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);

	const navigate = useNavigate();

	const { account, updateAuthAccount } = useAuth();

	useEffect(() => {
		if (!file) {
			setPreviewUrl(null);
			return;
		}

		const objectUrl = URL.createObjectURL(file);
		setPreviewUrl(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [file]);

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
			setError("Please select a file");
			return;
		}
		setIsLoading(true);
		setError(null);
		setSuccessMessage(null);

		const formData = new FormData();
		formData.append("image", file);

		try {
			const response = await makePut("users/profile/image", formData);
			const updatedAccount = {
				...account,
				profile_image_url: response.data.profile_image_url,
			};
			updateAuthAccount(updatedAccount);
			setSuccessMessage("Profile picture updated succesfully");
			setFile(null);
			navigate("/");
		} catch (err) {
			setError(err.message || "An unknown error occurred.");
		} finally {
			setIsLoading(false);
		}
	};
	const displayImage =
		previewUrl ||
		account?.profile_image_url ||
		"https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg";

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-dark-gray">Profile Picture</h2>
				<p className="text-gray-600 mt-1">Select a new image to upload.</p>
			</div>

			<div className="flex justify-center">
				<ProfileImageSmall image={displayImage} />
			</div>

			<div>
				<label htmlFor="file-upload" className="sr-only">
					choose a file
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
			<Button
				type="submit"
				disabled={isLoading || !file}
				text={isLoading ? "Uploading..." : "Save Picture"}
			/>
		</form>
	);
};

export default ProfilePictureUpload;
