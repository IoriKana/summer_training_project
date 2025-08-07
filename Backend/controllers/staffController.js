const STATUS = require("../modules/status").STATUS;
const respond = require("../modules/helperMethods").respond;
const { msToTime } = require("../modules/helperMethods");
const { catchAsync } = require("../utils/catchAsync");
const Staff = require("../models/staffModel");
const Account = require("../models/accountModel");
const AppError = require("../utils/appError");
const Ban = require("../models/banModel");
const { sendEmail } = require("../modules/senderModule");

function isLetter(str) {
	return str.length === 1 && str.match(/[a-z]/i);
}

exports.getAllStaff = catchAsync(async (req, res, next) => {
	const staffMembers = await Staff.find().populate("account");
	respond(res, STATUS.OK, "All staff members", staffMembers);
});

exports.getStaff = catchAsync(async (req, res, next) => {
	const staffMember = await Staff.findById(req.params.id).populate("account");

	if (!staffMember) {
		return next(
			new AppError("No staff member found with that ID", STATUS.NOT_FOUND)
		);
	}
	respond(res, STATUS.OK, "Staff member found", staffMember);
});
const toMilliseconds = (hrs, min, sec) =>
	(hrs * 60 * 60 + min * 60 + sec) * 1000;

exports.banUser = catchAsync(async (req, res, next) => {
	const { userId, banReason } = req.body;
	let banDuration = String(req.body.banDuration) || undefined;
	if (banDuration !== undefined) {
		if (banDuration.endsWith("d")) {
			const days = parseInt(banDuration.replace("d", ""));
			banDuration = toMilliseconds(24 * days, 0, 0) + Date.now();
		} else if (banDuration.endsWith("h")) {
			const hours = parseInt(banDuration.replace("h", ""));
			banDuration = toMilliseconds(hours, 0, 0) + Date.now();
		} else if (banDuration.endsWith("m")) {
			const minutes = parseInt(banDuration.replace("m", ""));
			banDuration = toMilliseconds(0, minutes, 0) + Date.now();
		} else {
			return next(
				new AppError("banDuration is not in correct form", STATUS.BAD_REQUEST)
			);
		}
	}

	if (!userId || !banReason) {
		return next(
			new AppError("must enter The userId and banReason", STATUS.BAD_REQUEST)
		);
	}

	const user = await Account.findById(userId);
	if (!user) {
		return next(new AppError("User not found ", STATUS.BAD_REQUEST));
	}
	if (
		req.account.role === "Admin" ||
		(user.role === "Staff" && req.account.role === "Admin") ||
		(req.account.role === "Staff" && user.role === "Customer")
	) {
		const banUser = await Ban.create({
			userId: userId,
			staffId: req.account._id,
			banDuration: banDuration,
			banReason: banReason,
		});

		await sendEmail({
			from: process.env.FROM_EMAIL,
			to: user.email,
			subject: process.env.BAN_SUBJECT,
			html: `
	<div style="max-width: 600px; margin: 40px auto; font-family: Arial, sans-serif; background-color: #1e1e1e; color: #f5f5f5; border: 1px solid #333; border-radius: 12px; padding: 32px; box-shadow: 0 0 10px rgba(0,0,0,0.6);">

      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://icons.veryicon.com/png/o/miscellaneous/logo-design-of-lingzhuyun/icon-correct-24-1.png" width="60" height="60"/>
        <p>AuraCart</p>
      </div>
      <hr>

      <h2 style="text-align: center; color: #ff4c4c; margin-top: 0;">Account Banned</h2>

      <p style="color: #ddd; font-size: 15px; line-height: 1.6; margin-top: 20px;">
        Your account on <strong>AuraCart</strong> has been banned for <strong>${msToTime(
					banUser.banDuration - Date.now()
				)}</strong> due to serious violations of our terms and policies.
      </p>

      <p style="color: #bbb; font-size: 15px; line-height: 1.6;">
        We have identified behavior that is strictly prohibited on our platform. This includes, but is not limited to, actions that compromise the safety, integrity, or fairness of our shop and community.
      </p>

      <p style="color: #bbb; font-size: 15px; line-height: 1.6;">
        Effective immediately, you are no longer allowed to access, use, or create any account on our platform. This decision is final. Continued attempts to access our services may result in further legal action or reporting to relevant authorities.
      </p>

      <p style="color: #bbb; font-size: 15px; line-height: 1.6;">
        If you believe this ban was made in error, you may contact us <strong>once only</strong> at:
      </p>

      <p style="text-align: center; font-size: 15px; color: #74b9ff; margin: 10px 0;">
        <a href="mailto:eapp2035@gmail.com" style="color: #74b9ff; text-decoration: none;">eapp2035@gmail.com</a>
      </p>

      <p style="color: #777; font-size: 13px; line-height: 1.6;">
        Please be aware that we are under no obligation to respond unless new and valid information is provided.
        We take our policies seriously to protect our platform and our customers.
      </p>

      <hr>

      <p style="text-align: center; font-size: 12px; color: #777;">
        Message by AuraCart
      </p>
    </div>
			`,
		});
		return respond(
			res,
			STATUS.OK,
			"The account has been successfully banned.",
			{ userInfo: banUser }
		);
	}
	return next(
		new AppError(
			"Access denied: You do not have the required permissions to perform this action.",
			STATUS.UNAUTHORIZED
		)
	);
});

exports.getAllBans = catchAsync(async (req, res, next) => {
	const allBans = await Ban.find().populate("staffId").populate("userId");

	respond(res, STATUS.OK, "BansInfo : ", allBans);
});

exports.getUserBans = catchAsync(async (req, res, next) => {
	const user = req.body.userId;
	// @ maged correct this when you are back
	const allBans = await Ban.find({ userID: user })
		.populate("staffId")
		.populate("userId");

	respond(res, STATUS.OK, "BansInfo : ", allBans);
});

exports.unbanAccount = catchAsync(async (req, res, next) => {
	const userId = req.body.userId;
	if (!userId) {
		return next(new AppError("must enter the userId :", STATUS.BAD_REQUEST));
	}
	const user = await Account.findById(userId);
	console.log(user.userName);
	if (!user) {
		return next(new AppError("Account not found ", STATUS.BAD_REQUEST));
	}
	if (req.account.role === "Admin" || req.account.role === "Staff") {
		const unbannedUser = await Ban.findOne({ userId: user._id });
		unbannedUser.banDuration = Date.now();

		await unbannedUser.save();
		await sendEmail({
			from: process.env.FROM_EMAIL,
			to: user.email,
			subject: "Account Update ",
			html: `
		<div style="max-width: 600px; margin: 40px auto; font-family: Arial, sans-serif; background-color: #1e1e1e; color: #f5f5f5; border: 1px solid #333; border-radius: 12px; padding: 32px; box-shadow: 0 0 10px rgba(0,0,0,0.6);">

		  <div style="text-align: center; margin-bottom: 20px;">
		    <img src="https://res.cloudinary.com/dqbl32cmw/image/upload/v1754528475/samples/logo.png" width="60" height="60"/>
		    <p>AuraCart</p>
		  </div>
		  <hr>

		  <h2 style="text-align: center; color: #4cd137; margin-top: 0;">Account Successfully Unbanned</h2>

		  <p style="color: #ddd; font-size: 15px; line-height: 1.6; margin-top: 20px;">
				<img src=${user.profile_image_url} width="40" height="40" style="border-radius: 50%"/><br>
		  		Dear <strong>${user.userName}</strong>,
		  </p>

		  <p style="color: #bbb; font-size: 15px; line-height: 1.6;">
		    We are pleased to inform you that your account on <strong>AuraCart</strong> has been successfully unbanned and access has been restored.
		  </p>

		  <p style="color: #bbb; font-size: 15px; line-height: 1.6;">
		    You may now log in and continue using our services as usual. Please make sure to follow our platform policies to avoid any future issues.
		  </p>

		  <p style="color: #bbb; font-size: 15px; line-height: 1.6;">
		    If you have any questions or need assistance, feel free to contact our support team.
		  </p>

		  <hr>

		  <p style="text-align: center; font-size: 13px; color: #777;">
		    Message by AuraCart
		  </p>
		</div>
				`,
		});
		return respond(
			res,
			STATUS.OK,
			"The account has been successfully unbanned.",
			{ userInfo: unbannedUser }
		);
	}
	return next(
		new AppError(
			"Access denied: You do not have the required permissions to perform this action.",
			STATUS.UNAUTHORIZED
		)
	);
});
exports.updateStaff = catchAsync(async (req, res, next) => {
	const staffMember = await Staff.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!staffMember) {
		return next(
			new AppError("No staff member found with that ID", STATUS.NOT_FOUND)
		);
	}
	respond(res, STATUS.OK, "Staff member updated", staffMember);
});

exports.resetAccountPassword = catchAsync(async (req, res, next) => {
	const { accountId, newpassword, confirmpassword } = req.body;
	if (!accountId || !newpassword || !confirmpassword) {
		return next(
			new AppError(
				"All fields are required: account ID, new password, and confirmation password.",
				STATUS.BAD_REQUEST
			)
		);
	}
	const userAccount = await Account.findById(accountId);
	if (!userAccount) {
		return next(
			new AppError(
				"Account not found. Please check the accountId or try again.",
				STATUS.BAD_REQUEST
			)
		);
	}
	userAccount.password = newpassword;
	await userAccount.save();
	await sendEmail({
		from: process.env.FROM_EMAIL,
		to: userAccount.email,
		subject: "password Changed By Staff",
		text: ``,
	});
	respond(res, STATUS.OK, "Password successfully changed.", userAccount);
});
exports.deleteStaff = catchAsync(async (req, res, next) => {
	const staffMember = await Staff.findByIdAndDelete(req.params.id);

	if (!staffMember) {
		return next(
			new AppError("No staff member found with that ID", STATUS.NOT_FOUND)
		);
	}

	await Account.findByIdAndDelete(staffMember.account);

	respond(res, STATUS.NO_CONTENT, null);
});
