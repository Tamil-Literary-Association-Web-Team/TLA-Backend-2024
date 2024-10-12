"use strict";
const mongoose = require("mongoose");

const makkalMantramQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [
    {
      value: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    required: true,
  },
});

const MakkalMantramQuestion = mongoose.model(
  "MakkalMantramQuestion",
  makkalMantramQuestionSchema
);

module.exports = MakkalMantramQuestion;
