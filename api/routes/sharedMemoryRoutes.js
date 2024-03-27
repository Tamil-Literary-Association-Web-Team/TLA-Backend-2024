const express = require("express");
const router = express.Router();
const sharedMemoryController = require("../controllers/sharedMemoryController");

const upload = require("multer")();

// GET all users
router.get("/", sharedMemoryController.getAllSharedMemories);

// POST a new user
router.post("/", upload.array("images"), sharedMemoryController.createMemory);

// GET an image
router.get("/image/:id", sharedMemoryController.getImage);


module.exports = router;
