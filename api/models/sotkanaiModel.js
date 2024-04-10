"use strict";
const mongoose = require("mongoose");

const sotkanaiSchema = new mongoose.Schema({
    name: String,
    districts: [{
      name: String,
      images: [String],
      schedule: {
        date: String,
        time: String,
        venue: String
      },
      winning_schools: {
        "1st_place": String,
        "2nd_place": String,
        "3rd_place": String
      },
      participated_schools: [String]
    }]
  });
  
  // Create model from schema
  const Sotkanai = mongoose.model('Sotkanai', sotkanaiSchema);

  module.exports = Sotkanai;
  