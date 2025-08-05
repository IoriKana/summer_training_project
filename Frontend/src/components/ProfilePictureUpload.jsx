import React, {
	useState,
	useEffect,
	useImperativeHandle,
	forwardRef,
} from "react";
import { makePut } from "../utils/makeRequest";
import { useAuth } from "../hooks/useAuth";
import ErrorMessage from "./ErrorMessage";
import { useNavigate } from "react-router-dom";

// We wrap the entire component in `forwardRef` to allow the parent
// to get a reference to this component's instance.
const ProfilePictureUpload = forwardRef(
	({ onFileStateChange = () => {}, hasPreview = true }, ref) => {
		// --- STATE MANAGEMENT ---
		// These states are all internal to this component's logic.
		const [file, setFile] = useState(null);
		const [previewUrl, setPreviewUrl] = useState(null);
		const [isLoading, setIsLoading] = useState(false);
		const [error, setError] = useState(null);
		const [successMessage, setSuccessMessage] = useState(null);

		const navigate = useNavigate();
		const { account, updateAuthAccount } = useAuth();

		useEffect(() => {
			if (!hasPreview || !file) {
				setPreviewUrl(null);
				return;
			}
			const objectUrl = URL.createObjectURL(file);
			setPreviewUrl(objectUrl);
			return () => URL.revokeObjectURL(objectUrl);
		}, [file, hasPreview]);

		const handleFileChange = (e) => {
			const selectedFile =
				e.target.files && e.target.files[0] ? e.target.files[0] : null;

			setFile(selectedFile);

			onFileStateChange(!!selectedFile);

			setError(null);
			setSuccessMessage(null);
		};

		const handleSubmit = async () => {
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
				setSuccessMessage("Profile picture updated successfully!");
				setFile(null);
				onFileStateChange(false);
			} catch (err) {
				setError(err.message || "An unknown error occurred.");
			} finally {
				setIsLoading(false);
			}
		};

		useImperativeHandle(ref, () => ({
			submit: handleSubmit,
		}));

		const displayImage = hasPreview
			? previewUrl ||
			  account?.profile_image_url ||
			  "https://i.stack.imgur.com/l60Hf.png"
			: account?.profile_image_url;

		return (
			<div className="w-full max-w-sm space-y-6">
				{hasPreview && (
					<div className="flex justify-center">
						<img
							src={displayImage}
							alt="Profile Preview"
							className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white bg-gray-200"
						/>
					</div>
				)}

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
			</div>
		);
	}
);

export default ProfilePictureUpload;
