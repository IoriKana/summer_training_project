const app = require("./app");

const dotenv = require("dotenv");

const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });

const port = process.env.PORT;

const connectionString = process.env.CONNECTION_STRING;

const Account = require("./models/accountModel");

async function ensureAdminAccount() {
	const adminEmail = process.env.ADMIN_EMAIL;
	const adminPassword = process.env.ADMIN_PASSWORD;
	if (!adminEmail || !adminPassword) {
		console.warn("ADMIN_EMAIL or ADMIN_PASSWORD not set in .env");
		return;
	}
	const existingAdmin = await Account.findOne({
		email: adminEmail,
		role: "Admin",
	});
	if (!existingAdmin) {
		await Account.create({
			userName: "Admin",
			email: adminEmail,
			password: adminPassword,
			role: "Admin",
		});
		console.log("Admin account created.");
	} else {
		console.log("Admin account already exists.");
	}
}

mongoose
	.connect(connectionString)
	.then(async () => {
		console.log("Connected to MongoDB");
		await ensureAdminAccount();
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((err) => {
		console.error("Failed to connect to MongoDB", err);
	});
