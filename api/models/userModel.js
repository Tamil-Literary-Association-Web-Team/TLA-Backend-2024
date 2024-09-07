"use strict";
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensuring email uniqueness
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
  },
  profileImage: { type: [String] },
  studentStatus: {
    type: String,
    required: true, // 'current' or 'passout'
  },
  studentRegistrationNumber: {
    type: String,
  },
  loggedInCookie: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// "use strict";
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   passwordHash: { type: String, required: true },
//   phoneNo: { type: String, required: true },
//   studentStatus: { type: String, required: true }, // 'current' or 'passout'
//   studentRegistrationNumber: { type: String, required: true },
//   profileImage: { type: String }, // Base64 encoded image
// });

// module.exports = mongoose.model("User", userSchema);
