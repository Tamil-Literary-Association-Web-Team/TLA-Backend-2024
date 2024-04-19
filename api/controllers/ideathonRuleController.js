const IdeathonRule = require("../models/ideathonRuleModel");

const ideathonRuleController = {
  getAllRules: async (req, res, next) => {
    try {
      const ideathonRules = await IdeathonRule.find();
      res.status(200).json(ideathonRules);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = ideathonRuleController;