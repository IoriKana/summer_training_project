import React from "react";
import { useAuth } from "../hooks/useAuth";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import Button from "../components/Button";

const ProfileImagePage = () => {
	const { account } = useAuth();

	return (
		<div className="bg-gradient-to-br from-pastel-pink via-pastel-purple to-pastel-blue min-h-screen flex flex-col items-center justify-center p-4">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-bold text-white text-shadow-md">
					Welcome, {account?.userName || "User"}
				</h1>
				<p className="text-white/80">
					Please select a profile image to proceed
				</p>
			</div>

			<div className="bg-white/90 p-8 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-sm">
				<ProfilePictureUpload refresh={false} redirectTo={"/"} />
			</div>
		</div>
	);
};

export default ProfileImagePage;
