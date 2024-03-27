const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("multer")();

// GET all users
router.get("/", userController.getAllUsers);

// POST a new user
router.post("/", upload.single("profileImage"), userController.createUser);

// GET current user info
router.get("/current", userController.getCurrentUser)

// GET a specific user by ID
router.get("/:userId", userController.getUserById);

// POST login
router.post("/login", userController.login)

// POST logout the currenty signed in user
router.post("/logout", userController.logout)

// GET user's profile image
router.get("/image/:id", userController.getProfileImage)

module.exports = router;
