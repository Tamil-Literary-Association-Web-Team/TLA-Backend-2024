const express = require("express");
const router = express.Router();
const ideathonController = require("../controllers/ideathonController");

router.get("/", ideathonController.getAllIdeathonStep);
// router.post("/", ideathonController.createIdeathonStep);
// router.patch("/:aramiyamId", ideathonController.updateIdeathonStep);

module.exports = router;
