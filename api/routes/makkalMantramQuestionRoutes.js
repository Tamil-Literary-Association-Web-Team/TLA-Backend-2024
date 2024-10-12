const express = require("express");
const router = express.Router();
const makkalMantramQuestionController = require("../controllers/MakkalMantramQuestionController");

const rateLimit = require("express-rate-limit");

// RateLimit Middleware
const otpRateLimiter = rateLimit({
  windowMs: 2260 * 60 * 1000,
  max: 1,
  message: { message: "Already Voted !" },
});

router.post(
  "/addvote",
  otpRateLimiter,
  makkalMantramQuestionController.addVote
);

router.get("/questions", makkalMantramQuestionController.loadQuestions);

// router.post("/_add_question", makkalMantramQuestionController.addQuestion);

module.exports = router;
