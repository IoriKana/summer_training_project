const Nodemailer = require("nodemailer");
exports.sendEmail = async (options) => {
	const transporter = Nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		secure: true, // or true if using port 465
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
	// const transporter = Nodemailer.createTransport({
	//     host:process.env.EMAIL_HOST,
	//     port : process.env.EMAIL_PORT,
	//     secure: false,
	//     auth : {
	//         user:process.env.EMAIL_USER,
	//         pass:process.env.EMAIL_PASS
	//     },
	// })
	const message = await transporter.sendMail({
		from: options.from,
		to: options.to,
		subject: options.subject,
		text: options.text,
		html: options.html,
	});
	console.log("Message sent : " + message.messageId);
};

/*
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // or true if using port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
*/
