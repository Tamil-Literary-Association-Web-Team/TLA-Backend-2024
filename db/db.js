"use strict";
const mongoose = require("mongoose");
const { mongodbUri } = require("../config/config");

mongoose.connect(mongodbUri);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = mongoose;
