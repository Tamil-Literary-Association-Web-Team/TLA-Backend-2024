const Brammam = require("../models/brammamModel");

const brammamController = {
  getAllBrammams: async (req, res, next) => {
    try {
      const brammams = await Brammam.find();
      res.status(200).json(brammams);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createBrammam: async (req, res, next) => {
    try {
      console.log("Creating");
      const newBrammam = await Brammam.create(req.body);
      res.status(201).json(newBrammam);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateBrammam: async (req, res, next) => {
    try {
      const id = req.params.brammamId;
      const brammam = await Brammam.findById(id);
      if (brammam) {
        brammam.set(req.body); // Update document properties
        const updatedBrammam = await brammam.save(); // Save the changes
        res.status(200).json(updatedBrammam);
      } else {
        res.status(404).json({ message: "Brammam not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteBrammam: async (req, res, next) => {
    try {
      const id = req.params.brammamId;
      const brammam = await Brammam.findById(id);
      if (brammam) {
        await brammam.deleteOne();
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Brammam not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getBrammamById: async (req, res, next) => {
    try {
      const id = req.params.brammamId;
      const brammam = await Brammam.findById(id);
      if (brammam) {
        res.status(200).json(brammam);
      } else {
        res.status(404).json({ message: "Brammam not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getBrammamByCategory: async (req, res, next) => {
    try {
      const category = req.params.category;
      const brammam = await Brammam.find({ nameEnglish: category });
      if (brammam) {
        res.status(200).json(brammam);
      } else {
        res.status(404).json({ message: "Brammam not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = brammamController;
