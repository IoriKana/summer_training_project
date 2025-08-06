import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { makePatch } from "../utils/makeRequest";
import Button from "../components/Button";
import EmailField from "../components/EmailField";
import UsernameField from "../components/UsernameField";
import ErrorMessage from "../components/ErrorMessage";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import ProfileImageLarge from "../components/ProfileImageLarge";

const ProfilePage = () => {
	const { account, updateAuthAccount } = useAuth();

	const [userName, setUserName] = useState(account?.userName || "");
	const [email, setEmail] = useState(account?.email || "");
	const [displayImageUrl, setDisplayImageUrl] = useState(
		account?.profile_image_url
	);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);

	useEffect(() => {
		if (account) {
			setUserName(account.userName);
			setEmail(account.email);
			setDisplayImageUrl(account.profile_image_url);
		}
	}, [account]);

	const handleDetailsSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccessMessage(null);

		try {
			const payload = { userName, email };
			const response = await makePatch("accounts/me", payload);

			if (response.data?.account) {
				updateAuthAccount(response.data.account);
			}
			setSuccessMessage("Details updated successfully!");
		} catch (err) {
			setError(err.message || "An unknown error occurred.");
		} finally {
			setIsLoading(false);
		}
	};

	const hasChanges = userName !== account?.userName || email !== account?.email;

	return (
		<div className="bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue min-h-screen p-4 sm:p-8">
			<div className="container mx-auto bg-white/60 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10 max-w-4xl">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-dark-gray font-heading">
						Profile
					</h1>
				</div>

				<div className="md:grid-cols-3 md:gap-12">
					<div className="flex flex-col items-center text-center gap-4 ">
						<div className=" h-100 w-100">
							<ProfileImageLarge image={displayImageUrl} />
						</div>
						<div>
							<ProfilePictureUpload />
						</div>
					</div>

					<div className="md:col-span-2 mt-8 md:mt-0">
						<form onSubmit={handleDetailsSubmit} className="space-y-6">
							<UsernameField
								label="Username"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
							/>
							<EmailField
								label="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>

							<div className="pt-4">
								<ErrorMessage error={error} />
								{successMessage && (
									<p className="text-green-600 mb-4">{successMessage}</p>
								)}

								<Button
									type="submit"
									disabled={isLoading || !hasChanges}
									text={isLoading ? "Saving..." : "Save Details"}
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
