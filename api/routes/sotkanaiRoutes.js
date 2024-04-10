const express = require("express");
const router = express.Router();
const sotkanaiController = require("../controllers/sotkanaiController");

router.get("/", sotkanaiController.getAllSotkanais);
router.post("/", sotkanaiController.createSotkanai);
router.patch("/:aramiyamId", sotkanaiController.updateSotkanai);

module.exports = router;
