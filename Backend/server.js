const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });

const port = process.env.PORT;
const connectionString = process.env.CONNECTION_STRING;

// NECESSARY: Import both models now
const Account = require("./models/accountModel");
const Staff = require("./models/staffModel");

// FIXED: The function now ensures both the Account and Staff profile exist.
async function ensureAdminAccount() {
	const adminEmail = process.env.ADMIN_EMAIL;
	const adminPassword = process.env.ADMIN_PASSWORD;
	if (!adminEmail || !adminPassword) {
		console.warn("ADMIN_EMAIL or ADMIN_PASSWORD not set in .env. Cannot create admin.");
		return;
	}

    // This check remains the same and is perfectly fine.
	const existingAdmin = await Account.findOne({
		email: adminEmail,
		role: "Admin",
	});

	if (!existingAdmin) {
        console.log("Admin account not found. Creating a new one...");
		// Step 1: Create the Account document
		const newAdminAccount = await Account.create({
			userName: "Admin",
			email: adminEmail,
			password: adminPassword,
			role: "Admin",
		});

        // Step 2: Create the corresponding Staff document and link it
        await Staff.create({
            name: newAdminAccount.userName, // Or simply "Admin"
            account: newAdminAccount._id,
            // role: 'Admin'
        });

		console.log("Admin account and staff profile created successfully.");
	} else {
		console.log("Admin account already exists.");
	}
}

mongoose
	.connect(connectionString)
	.then(async () => {
		console.log("Connected to MongoDB");
		// This call now correctly sets up the admin user
		await ensureAdminAccount();
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((err) => {
		console.error("Failed to connect to MongoDB", err);
	});