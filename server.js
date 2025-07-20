const app = require("./app");

const dotenv = require("dotenv");

const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 3000;

const connectionString = process.env.CONNECTION_STRING;

mongoose
	.connect(connectionString)
	.then(() => {
		console.log("Connected to MongoDB");
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((err) => {
		console.error("Failed to connect to MongoDB", err);
	});
