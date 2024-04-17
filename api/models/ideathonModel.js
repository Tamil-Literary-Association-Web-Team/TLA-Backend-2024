"use strict";
const mongoose = require("mongoose");

const ideathonSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  link:{
    type: String,
    required: true,
  },
  linkDescription:{
    type: String,
    required: true,
  }
});

const Ideathon = mongoose.model("Ideathon", ideathonSchema);

module.exports = Ideathon;
