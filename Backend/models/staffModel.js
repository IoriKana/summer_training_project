const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
	salary: {
		type: Number,
		require: [true, "Salary is required."],
	},
	
	hiringDate: {
		type: Date,
		require: [true, "HiringDate is required."]
	},

	account: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Account",
		required: true,
	},
});

module.exports = new mongoose.model("Staff", staffSchema);
