const express = require("express");
const router = express.Router();
const ideathonRuleController = require("../controllers/ideathonRuleController");

router.get("/", ideathonRuleController.getAllRules);

module.exports = router;