"use strict";
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	passwordHash: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	phoneNo: {
		type: String
	},
	profileImageId: {
		type: String
	},
	loggedInCookie: {
		type: String
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
