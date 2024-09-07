const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const connection = mongoose.connection;

// Create storage engine using an existing connection
const storage = new GridFsStorage({
  db: connection, // Use existing connection
  file: (req, file) => {
    return {
      bucketName: "user_profile_images",
      filename: file.originalname,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
