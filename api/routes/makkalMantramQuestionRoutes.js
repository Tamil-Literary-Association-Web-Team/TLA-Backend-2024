const express = require("express");
const router = express.Router();
const makkalMantramQuestionController = require("../controllers/MakkalMantramQuestionController");

const rateLimit = require("express-rate-limit");

// RateLimit Middleware
const voteRateLimiter = rateLimit({
  windowMs: 2260 * 60 * 1000,
  max: 1,
  message: { message: "நீங்கள் ஏற்கனவே வாக்களித்துள்ளீர்கள்!" },
});

router.post(
  "/addvote",
  voteRateLimiter,
  makkalMantramQuestionController.addVote
);

router.get("/questions", makkalMantramQuestionController.loadQuestions);

// router.post("/_add_question", makkalMantramQuestionController.addQuestion);

module.exports = router;
