const fs = require("fs").promises;

exports.readFile = async (filePath) => {
	try {
		const data = await fs.readFile(filePath, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		console.error(`Error reading file from disk: ${error}`);
		throw error;
	}
};

exports.writeFile = async (filePath, data) => {
	try {
		await fs.writeFile(filePath, JSON.stringify(data, null, 2));
	} catch (error) {
		console.error(`Error writing file to disk: ${error}`);
		throw error;
	}
};

exports.formJsonResponse = (res, status, message, data = null) => {
	res.status(status).json({ message, data });
};

// easter egg cat!
exports.catUrl =
	"https://i.pinimg.com/736x/e6/0f/4b/e60f4bb3603dd4904041c8f7c53212a7.jpg";
