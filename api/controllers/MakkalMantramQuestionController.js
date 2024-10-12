const MakkalMantramQuestion = require("../models/MakkalMantramQuestionModel");
const MakkalMantramQuestionVote = require("../models/makkalMantramQuestionVoteModel");
const { default: mongoose } = require("mongoose");

const makkalMantramQuestionController = {
  loadQuestions: async (req, res, next) => {
    try {
      // status: 1: to be opened
      // status: 2: opened
      // status: 3: closed
      let data = await MakkalMantramQuestion.findOne().lean(); // Convert to plain object
      if (data.status === "3") {
        const result = await MakkalMantramQuestionVote.aggregate([
          {
            $group: {
              _id: "$answer",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              answerId: "$_id",
              count: 1,
            },
          },
        ]);

        data.results = result; // Safely add the results field
        return res.status(200).json(data);
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addQuestion: async (req, res, next) => {
    try {
      const { question, answers, status } = req.body;
      if (!question || !answers || !status) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const newQuestion = new MakkalMantramQuestion({
        question,
        answers,
        status,
      });
      const savedQuestion = await newQuestion.save();
      res.status(201).json(savedQuestion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addVote: async (req, res, next) => {
    try {
      const { answerid, questionid } = req.body;
      if (!answerid || !questionid) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      // validate answer id
      if (!mongoose.Types.ObjectId.isValid(answerid)) {
        return res.status(400).json({ error: "Invalid answerid" });
      }
      // validate question id
      if (!mongoose.Types.ObjectId.isValid(questionid)) {
        return res.status(400).json({ error: "Invalid questionid" });
      }
      // check if the question is available
      const question = await MakkalMantramQuestion.findById(questionid);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      // check if the question is already closed
      console.log(question);
      if (question.status !== "2") {
        return res
          .status(400)
          .json({ error: "Question is closed or Question is not opened" });
      }
      // check if the answerid is available

      // Save answer
      const newVote = new MakkalMantramQuestionVote({
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        answer: answerid,
      });
      const savedVote = await newVote.save();
      res.status(201).json(savedVote);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = makkalMantramQuestionController;
