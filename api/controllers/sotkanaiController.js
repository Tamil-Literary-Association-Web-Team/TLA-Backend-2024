const Sotkanai = require("../models/sotkanaiModel");

const sotkanaiController = {
  getAllSotkanais: async (req, res, next) => {
    try {
      const sotkanais = await Sotkanai.find();
      res.status(200).json(sotkanais);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // createSotkanai: async (req, res, next) => {
  //   try {
  //     const newSotkanai = await Sotkanai.create(req.body);
  //     res.status(201).json(newSotkanai);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // },

  // updateSotkanai: async (req, res, next) => {
  //   try {
  //     const id = req.params.aramiyamId;
  //     const sotkanai = await Sotkanai.findById(id);
  //     if (sotkanai) {
  //       aramiyam.set(req.body); // Update document properties
  //       const updatedSotkanai = await sotkanai.save(); // Save the changes
  //       res.status(200).json(updatedSotkanai);
  //     } else {
  //       res.status(404).json({ message: "Sotkanai not found" });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // },
};

module.exports = sotkanaiController;
