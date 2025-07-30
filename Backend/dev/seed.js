const dotenv = require("dotenv");

const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });
const port = process.env.PORT;

const connectionString = process.env.CONNECTION_STRING;
mongoose
	.connect(connectionString)
	.then(async () => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.error("Failed to connect to MongoDB", err);
	});
exports.imoportdb = (MODEL, LIST) => {
	MODEL.create(LIST)
		.then(() => {
			console.log(`Data imported to ${MODEL.modelName} collection`);
		})
		.catch((err) => {
			console.error(
				`Error importing data to ${MODEL.modelName} collection:`,
				err
			);
		});
};
exports.emptydb = (MODEL) => {
	MODEL.deleteMany()
		.then(() => {
			console.log(`Data deleted from ${MODEL.modelName} collection`);
		})
		.catch((err) => {
			console.error(
				`Error deleting data from ${MODEL.modelName} collection:`,
				err
			);
		});
};
