"use strict";
const mongoose = require("mongoose");

const brammamSchema = new mongoose.Schema({
  nameEnglish: {
    type: String,
    required: true,
  },
  nameTamil: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  showWinners: {
    type: Boolean,
    required: true,
  },
  showCompetitionDetails: {
    type: Boolean,
    required: true,
  },
  themes: [
    {
      type: String,
    },
  ],
  rules: [
    {
      type: String,
    },
  ],
  prize: [
    {
      type: Object,
    },
  ],
  winner1: {
    type: String,
  },
  winner2: {
    type: String,
  },
});

const Brammam = mongoose.model("Brammam", brammamSchema);

module.exports = Brammam;
