const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;

const Account = require("../models/accountModel");

exports.getAllAccounts = async (req, res) => {
	try {
		const accountList = await Account.find();
		respond(res, STATUS.OK, "success", accountList);
	} catch (err) {
		respond(res, STATUS.INTERNAL_SERVER_ERROR, `failed: ${err.message}`);
	}
};

exports.getAccountByID = async (req, res) => {
	try {
		const account = Account.findById(req.params.id);

		if (!account) {
			return respond(res, STATUS.NOT_FOUND, "account not found");
		}

		respond(res, STATUS.OK, "account found: ", account);
	} catch (err) {
		respond(res, STATUS.INTERNAL_SERVER_ERROR, `failed:${err.message}`);
	}
};

exports.createAccount = async (req, res) => {
	try {
		const account = await Account.create(req.body);
		respond(res, STATUS.CREATED, "new account created: ", account);
	} catch (err) {}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return respond(res, STATUS.BAD_REQUEST, "must enter email and password");
		}

		const account = await Account.findOne({ email: email }).select("+password");
		const isMatch = account && (await account.comparePassword(password));

		if (!isMatch) {
			return respond(res, STATUS.UNAUTHORIZED, "Invalid credentials");
		}

		console.log(`succesfully logged in to account: ${email}`);
		return respond(res, STATUS.OK, "logged in succesfully", { email: email });
	} catch (err) {
		respond(res, STATUS.INTERNAL_SERVER_ERROR, `failed: ${err.message}`);
	}
};

// http://localhost:3000/api/
// /account/create
// /user/create
// /user/get
// /account/get
// etc...
