"use strict";
const mongoose = require("mongoose");

const aramiyamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  speaker: {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      required: true,
    }
  },
  youtubeLink: {
    type: String,
    required: true,
  }
});

const Aramiyam = mongoose.model("Aramiyam", aramiyamSchema);

module.exports = Aramiyam;
