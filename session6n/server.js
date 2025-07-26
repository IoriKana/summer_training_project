// Import the Express app instance from app.js
const app = require("./app");

// Import dotenv to load environment variables from .env file
const dotenv = require("dotenv");

// Import mongoose to connect to MongoDB
const mongoose = require("mongoose");

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// Get the port number from environment variables or use 8080 by default
const PortNumber = process.env.PORT || 8080;

// Replace <db_password> placeholder in DB connection string with actual password
const dbAtlasString = process.env.DB.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

// Connect to MongoDB Atlas using Mongoose
mongoose
  .connect(dbAtlasString)
  .then(() => {
    console.log("DB connection successfully");
  })
  .catch((err) => {
    console.log(err.message); // Show error message if connection fails
  });

// Start the Express server and listen on the given port
app.listen(PortNumber, () => {
  console.log(`server is running on port ${PortNumber}`);
});
