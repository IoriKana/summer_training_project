const fs = require("fs");
const product = require("../models/productModel.js");
const user = require("../models/userModel.js");
const account = require("../models/accountModel.js");
const staff = require("../models/staffModel.js")
const { imoportdb, emptydb } = require("./seed.js");
const obj = {
	product: { model: product, filepath: `${__dirname}/products.json` },
	staff: { model: staff, filepath: `${__dirname}/staff.json` },
	user: { model: user, filepath: `${__dirname}/user.json` },
	account: { model: account, filepath: `${__dirname}/account.json` },

};

// const list = JSON.parse(
// 	fs.readFileSync(obj[process.argv[3]].filepath, "utf-8")
// );

if (process.argv[2] == "--import") {
	imoportdb(obj[process.argv[3]].model, list);
} else if (process.argv[2] == "--delete") {
	emptydb(obj[process.argv[3]].model);
}
