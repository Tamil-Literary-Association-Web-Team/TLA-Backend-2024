"use strict";
const mongoose = require("mongoose");

const makkalMantramQuestionVoteSchema = new mongoose.Schema({
  // ip: {
  //   type: String,
  //   required: true,
  // },
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const MakkalMantramQuestionVote = mongoose.model(
  "MakkalMantramQuestionVote",
  makkalMantramQuestionVoteSchema
);

module.exports = MakkalMantramQuestionVote;
