"use strict";
const mongoose = require("mongoose");

const sharedMemorySchema = new mongoose.Schema({
	sharedBy: {
		type: String,
		required: true,
	},
	heading: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true,
	},
	// array of consisting of each image's _id 
	images: {
		type: [String],
	},
});

const SharedMemory = mongoose.model("SharedMemory", sharedMemorySchema);

module.exports = SharedMemory;
