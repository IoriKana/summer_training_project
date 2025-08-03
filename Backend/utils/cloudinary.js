// middleware/cloudinary.js

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();

// Configure the Cloudinary SDK with your credentials
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const streamUpload = (folderName) => (req, res, next) => {
	if (!req.file) {
		return next(new Error("No file uploaded."));
	}

	// This function handles the actual upload stream
	const uploadStream = cloudinary.uploader.upload_stream(
		{
			folder: folderName,
		},
		(error, result) => {
			if (error) {
				return next(error);
			}
			// Attach the Cloudinary result to the request object
			// so the next middleware (our controller) can access it.
			req.cloudinary = result;
			next();
		}
	);

	// Use streamifier to convert the buffer into a readable stream
	// that the Cloudinary SDK can consume.
	streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

module.exports = streamUpload;
