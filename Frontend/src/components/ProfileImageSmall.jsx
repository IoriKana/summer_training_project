import React from "react";

const DEFAULT_PROFILE_IMAGE =
	"https://media.istockphoto.com/id/922962354/vector/no-image-available-sign.jpg?s=612x612&w=0&k=20&c=xbGzQiL_UIMFDUZte1U0end0p3E8iwocIOGt_swlywE=";

const ProfileImageSmall = ({ image }) => {
	const imageUrl = image || DEFAULT_PROFILE_IMAGE;
	return (
		<img
			src={imageUrl}
			alt="profile image"
			className="w-12 h-12 rounded-full object-cover bg-gray-300"
		/>
	);
};

export default ProfileImageSmall;
