const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [12, "First name must not exceed 12 characters"],
      validate: {
        validator: (val) => {
          const isArabic = validator.isAlpha(val, "ar-AE", { ignore: " " });
          const isEnglish = validator.isAlpha(val, "en-US", { ignore: " " });
          return isArabic || isEnglish;
        },
        message: "First name must contain only Arabic or English letters",
      },
    },
    lastName: {
      type: String,
      required: [true, "user must have a last name"],
      minlength: [3, "user last name must be at least 3 chararcters"],
      maxlength: [12, "user last name not more than 12 characters"],
      validate: {
        validator: (val) => {
          const isArabic = validator.isAlpha(val, "ar-AE", { ignore: " " });
          const isEnglish = validator.isAlpha(val, "en-US", { ignore: " " });
          return isArabic || isEnglish;
        },
        message: "First name must contain only Arabic or English letters",
      },
    },
    email: {
      type: String,
      required: [true, "User must have a email"],
      unique: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    username: {
      type: String,
      required: [true, "User must have a username"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User must have a password"],
      validate: [
        validator.isStrongPassword,
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
      ],
      select: false,
    },

    phone: {
      type: String,
      required: [true, "User must have a number"],
      unique: true,
      validate: {
        validator: function (value) {
          return RegExp(/^01[0-2,5]{1}[0-9]{8}$/gm).test(value);
        },
        message: "invalid number ",
      },
    },
    age: {
      type: Number,
      min: [15, "user must be at least 15 years old"],
      max: [100, "user must be at most 100 years old"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: "Gender must be male or female",
      },
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "customer"],
      },
      default: "customer",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // add createdAt and updatedAt
  }
);

// Virtual full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.correctPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
