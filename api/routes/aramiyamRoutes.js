const express = require("express");
const router = express.Router();
const aramiyamController = require("../controllers/aramiyamController");

router.get("/", aramiyamController.getAllAramiyams);
// router.post("/", aramiyamController.createAramiyam);
// router.patch("/:aramiyamId", aramiyamController.updateAramiyam);

module.exports = router;
