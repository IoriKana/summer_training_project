const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;

const User = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
	try {
		const userList = await User.find();
		respond(res, STATUS.OK, "success", userList);
	} catch (err) {
		respond(res, STATUS.INTERNAL_SERVER_ERROR, `failed:${err.message}`);
	}
};

exports.getUserByID = async (req, res) => {
	try {
		const user = User.findById(req.params.id);

		if (!user) {
			return respond(res, STATUS.NOT_FOUND, "user not found");
		}

		respond(res, STATUS.OK, "user found: ", user);
	} catch (err) {
		respond(res, STATUS.INTERNAL_SERVER_ERROR, `failed:${err.message}`);
	}
};

exports.createUser = async (req, res) => {
	try {
		const user = await User.create(req.body);
		respond(res, STATUS.CREATED, "new user created: ", user);
	} catch (err) {}
};

exports.updateUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return respond(res, STATUS.NOT_FOUND, "User not found");
		}
		Object.assign(user, req.body);
		const updatedUser = await user.save();

		respond(res, STATUS.OK, "user updated: ", updatedUser);
	} catch (err) {
		respond(res, STATUS.INTERNAL_SERVER_ERROR, `failed:${err.message}`);
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return respond(res, STATUS.NOT_FOUND, "User not found");
		}

		Object.assign(user, { deleted: true });
		await user.save();
		respond(res, STATUS.OK, "user deleted! ");
	} catch (err) {
		respond(res, STATUS.INTERNAL_SERVER_ERROR, `failed:${err.message}`);
	}
};
