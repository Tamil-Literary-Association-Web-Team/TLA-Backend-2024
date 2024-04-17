const Ideathon = require("../models/ideathonModel");

const ideathonController = {
  getAllIdeathonStep: async (req, res, next) => {
    try {
      const ideathons = await Ideathon.find();
      res.status(200).json(ideathons);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createIdeathonStep: async (req, res, next) => {
    try {
      const newIdeathon = await Ideathon.create(req.body);
      res.status(201).json(newIdeathon);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateIdeathonStep: async (req, res, next) => {
    try {
      const id = req.params.aramiyamId;
      const ideathon = await Ideathon.findById(id);
      if (ideathon) {
        ideathon.set(req.body); // Update document properties
        const updatedIdeathon = await ideathon.save(); // Save the changes
        res.status(200).json(updatedIdeathon);
      } else {
        res.status(404).json({ message: "Ideathon not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = ideathonController;
