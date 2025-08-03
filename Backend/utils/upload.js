// The NEW middleware/upload.js

const multer = require("multer");

// Configure multer to store files in memory as Buffer objects
const memoryStorage = multer.memoryStorage();

const upload = multer({
	storage: memoryStorage,
	limits: {
		fileSize: 1024 * 1024 * 5, // 5MB file size limit
	},
	fileFilter: (req, file, cb) => {
		// Simple file type validation
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Not an image! Please upload only images."), false);
		}
	},
});

module.exports = upload;
