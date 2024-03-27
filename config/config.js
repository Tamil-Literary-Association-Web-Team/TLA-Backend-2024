"use strict";

const dotenv = require("dotenv");
const assert = require("assert");

dotenv.config();

const { PORT, HOST_URL, HOST, MONGODB_URI } = process.env;

assert(PORT, "PORT is required");
assert(HOST_URL, "HOST_URL is required");
assert(HOST, "HOST is required");
assert(MONGODB_URI, "MONGODB_URI is required");

module.exports = {
  port: PORT,
  url: HOST_URL,
  host: HOST,
  mongodbUri: MONGODB_URI
};
