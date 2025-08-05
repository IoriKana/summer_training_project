import React, { useState, useEffect, useRef } from "react";
import ProfileImageLarge from "../components/ProfileImageLarge";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import SmallButton from "../components/SmallButton";

const ProfilePage = () => {
	const uploadRef = useRef();
	const { account } = useAuth();

	const [isFileSelected, setIsFileSelected] = useState(false);

	const [displayImageUrl, setDisplayImageUrl] = useState(
		account?.profile_image_url
	);

	useEffect(() => {
		setDisplayImageUrl(account?.profile_image_url);
	}, [account]);

	const handleSave = () => {
		if (uploadRef.current) {
			uploadRef.current.submit();
			setIsFileSelected(false);
		}
	};

	return (
		<div className="bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue min-h-screen p-4 sm:p-8">
			<div className="container mx-auto bg-white/35 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-4xl">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-dark-gray font-heading">
						My Profile
					</h1>
				</div>
				<div className="md:grid md:grid-cols-3 md:gap-8">
					<div className="md:col-span-1 flex flex-col items-center text-center">
						<ProfileImageLarge image={displayImageUrl} />
						<ProfilePictureUpload
							hasPreview={false}
							ref={uploadRef}
							onFileStateChange={setIsFileSelected}
						/>

						{isFileSelected && (
							<div className="mt-4 w-full">
								<SmallButton
									className="pl-5"
									text="Save New Picture"
									onClick={handleSave}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
