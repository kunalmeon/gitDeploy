const mongoose = require("mongoose");

const validator = require("validator");
const bycrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
  },

  email: {
    type: String,
    required: [true, "please provide your email address"],
    unique: true,
    lowercase: true,

    validate: [validator.isEmail, "please enter valid email address"],
  },
  /*2 a) We will define couple of funtion for the image. */
  photo:{
    type:String,
    default:'default.jpg'
  },
  role: {
    type: String,
    enum: ["admin", "user", "ceo"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "please provide password"],
    minLength: 8,

    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "password does not match",
    },
  },

  passwordChangedAt: Date,

  passwordResetToken: String,
  passwordResetExpiresAt: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bycrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.passwordCompare = async function (
  userEnteredPswd,
  databaseSavedPswd
) {
  return await bycrypt.compare(userEnteredPswd, databaseSavedPswd);
};

userSchema.methods.changedPasswordAfter = function (tokenIssuedTime) {
  if (this.passwordChangedAt) {
    const passwordChangedTimeInSec = parseInt(
      this.passwordChangedAt.getTime() / 1000
    );

    return passwordChangedTimeInSec > tokenIssuedTime;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
