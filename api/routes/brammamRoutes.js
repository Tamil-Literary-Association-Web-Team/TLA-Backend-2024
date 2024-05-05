const express = require("express");
const router = express.Router();
const brammamController = require("../controllers/brammamController");

router.get("/", brammamController.getAllBrammams);
router.post("/", brammamController.createBrammam);
router.get("/:category", brammamController.getBrammamByCategory);
// router.get("/:brammamId", brammamController.getBrammamById);
// router.patch("/:brammamId", brammamController.updateBrammam);
// router.delete("/:brammamId", brammamController.deleteBrammam);

module.exports = router;
