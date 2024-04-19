"use strict";
const mongoose = require("mongoose");

const ideathonRuleSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    }
});

const IdeathonRule = mongoose.model("IdeathonRule", ideathonRuleSchema);
module.exports = IdeathonRule;
