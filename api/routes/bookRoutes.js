const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/", bookController.getAllBooks);
// router.post("/", aramiyamController.createAramiyam);
// router.patch("/:aramiyamId", aramiyamController.updateAramiyam);

module.exports = router;
