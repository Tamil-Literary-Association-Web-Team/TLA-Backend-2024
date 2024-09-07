// const crypto = require("crypto");
// const bcrypt = require("bcrypt");
// const fs = require("fs");
// const User = require("../models/userModel");
// const mongoose = require("mongoose");
// const { Readable } = require("stream");
// const { url } = require("../../config/config");

// const USER_PROFILE_IMAGES_BUCKET_NAME = "user_profile_images";

// const COOKIE_USER_ID = "uid";
// const _1month = 864000000; // 1 month in milliseconds
// const SALT_ROUNDS = 11;

// /**
//  * @type {mongoose.mongo.GridFSBucket}
//  */
// let gridFsBucket;
// const connection = mongoose.connection;

// connection.once("open", () => {
//   gridFsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
//     bucketName: USER_PROFILE_IMAGES_BUCKET_NAME,
//   });
// });

// /**
//  * @param {string} email
//  */
// function createLoggedInCookie(email) {
//   if (typeof email !== "string") {
//     return "";
//   }

//   const hash = crypto.createHash("sha1");
//   const hashKey = `${email}--${new Date().toISOString()}`;
//   hash.update(hashKey);
//   return hash.digest("hex");
// }

// /**
//  * @param {string} profileImageId
//  */
// function userImageUrl(profileImageId) {
//   return `${url}/users/image/${profileImageId || "not-found"}`;
// }

// function stringifyUser(user) {
//   return {
//     _id: user._id,
//     email: user.email,
//     name: user.name,
//     phoneNo: user.phoneNo,
//     studentStatus: user.studentStatus,
//     studentRegistrationNumber: user.studentRegistrationNumber,
//     profileImageUrl: userImageUrl(user.profileImageId),
//   };
// }

// module.exports = {
//   COOKIE_USER_ID,
//   userImageUrl,
//   getAllUsers: async (req, res) => {
//     try {
//       const users = await User.find();
//       const stringifiedUsers = users.map((user) => stringifyUser(user));
//       res.status(200).json(stringifiedUsers);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },
//   getUserById: async (req, res) => {
//     try {
//       const id = req.params.userId;
//       const user = await User.findById(id);
//       if (user) {
//         res.status(200).json(stringifyUser(user));
//       } else {
//         res.status(404).json({ message: "User not found" });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },
//   login: async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       if (!email || !password || typeof email !== "string") {
//         return res
//           .status(400)
//           .json({ error: "Email or password is not provided" });
//       }

//       const user = await User.findOne({ email: email.toLowerCase() });
//       if (!user) {
//         return res.status(400).json({ error: "Incorrect email or password" });
//       }

//       const isCorrect = await bcrypt.compare(password, user.passwordHash);
//       if (!isCorrect) {
//         return res.status(400).json({ error: "Incorrect email or password" });
//       }

//       const cookie = createLoggedInCookie(email);
//       user.loggedInCookie = cookie;
//       await user.save();

//       res
//         .status(200)
//         .cookie(COOKIE_USER_ID, cookie, {
//           maxAge: _1month,
//           sameSite: "lax",
//           domain: "127.0.0.1",
//         })
//         .json(stringifyUser(user));
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },
//   createUser: async (req, res) => {
//     try {
//       const {
//         name,
//         email,
//         password,
//         phoneNo,
//         studentStatus,
//         studentRegistrationNumber,
//       } = req.body;

//       console.log(req.body);
//       if (
//         !name ||
//         !email ||
//         !password ||
//         !studentStatus ||
//         typeof email !== "string"
//       ) {
//         return res
//           .status(400)
//           .json({ error: "One or more required fields are left empty" });
//       }

//       const existingUser = await User.findOne({ email: email.toLowerCase() });
//       if (existingUser) {
//         return res.status(400).json({ error: "User already exists" });
//       }

//       const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
//       const cookie = createLoggedInCookie(email);

//       let profileImageId;
//       const image = req.body.profileImage;
//       if (image) {
//         profileImageId = await new Promise((resolve, reject) => {
//           const readStream = new Readable({
//             read() {
//               this.push(image.buffer);
//               this.push(null);
//             },
//           });
//           const uploadStream = gridFsBucket.openUploadStream(
//             image.originalname
//           );
//           const piped = readStream.pipe(uploadStream);
//           piped.on("finish", () => resolve(uploadStream.id.toString()));
//           piped.on("error", reject);
//         });
//       }

//       const user = await User.create({
//         email: email.toLowerCase(),
//         passwordHash,
//         name,
//         phoneNo,
//         profileImageId,
//         loggedInCookie: cookie,
//         studentStatus,
//         studentRegistrationNumber,
//       });

//       res
//         .status(201)
//         .cookie(COOKIE_USER_ID, cookie, {
//           maxAge: _1month,
//           sameSite: "lax",
//           domain: "127.0.0.1",
//         })
//         .json(stringifyUser(user));
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },
//   getCurrentUser: async (req, res) => {
//     try {
//       const cookies = req.cookies;
//       if (!cookies || !cookies[COOKIE_USER_ID]) {
//         return res.status(404).json({ error: "No current user" });
//       }

//       const userCookie = cookies[COOKIE_USER_ID];
//       const user = await User.findOne({ loggedInCookie: userCookie });

//       if (!user) {
//         return res.status(404).json({ error: "No user found" });
//       }

//       res.status(200).json(stringifyUser(user));
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },
//   logout: async (req, res) => {
//     try {
//       const cookies = req.cookies;
//       if (!cookies || !cookies[COOKIE_USER_ID]) {
//         return res.status(200).json({ message: "Not logged in" });
//       }

//       const userCookie = cookies[COOKIE_USER_ID];
//       const user = await User.findOne({ loggedInCookie: userCookie });

//       if (user) {
//         user.loggedInCookie = undefined;
//         await user.save();
//       }

//       res.status(200).clearCookie(COOKIE_USER_ID).send();
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },
//   getProfileImage: async (req, res) => {
//     const fileId = req.params.id;

//     if (typeof fileId !== "string") {
//       return res.status(404).json({ error: "Invalid image id" });
//     }

//     if (fileId === "not-found") {
//       return fs.createReadStream("assets/user-mock-image.png").pipe(res);
//     }

//     try {
//       const file = await gridFsBucket
//         .find({ _id: new mongoose.Types.ObjectId(fileId) })
//         .toArray();
//       if (file.length === 0) {
//         return fs.createReadStream("assets/user-mock-image.png").pipe(res);
//       }

//       const fileDoc = file[0];
//       gridFsBucket.openDownloadStream(fileDoc._id).pipe(res);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },
// };

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const multer = require("multer");

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const COOKIE_USER_ID = "uid";
const _1month = 864000000; // 1 month in milliseconds
const SALT_ROUNDS = 11;

/**
 * @param {string} email
 */
function createLoggedInCookie(email) {
  if (typeof email !== "string") {
    return "";
  }

  const hash = crypto.createHash("sha1");
  const hashKey = `${email}--${new Date().toISOString()}`;
  hash.update(hashKey);
  return hash.digest("hex");
}

function stringifyUser(user) {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    phoneNo: user.phoneNo,
    studentStatus: user.studentStatus,
    studentRegistrationNumber: user.studentRegistrationNumber,
    profileImage: user.profileImage || null, // Base64 image or null
  };
}

module.exports = {
  COOKIE_USER_ID,

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      const stringifiedUsers = users.map((user) => stringifyUser(user));
      res.status(200).json(stringifiedUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const id = req.params.userId;
      const user = await User.findById(id);
      if (user) {
        res.status(200).json(stringifyUser(user));
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password || typeof email !== "string") {
        return res
          .status(400)
          .json({ error: "Email or password is not provided" });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ error: "Incorrect email or password" });
      }

      const isCorrect = await bcrypt.compare(password, user.passwordHash);
      if (!isCorrect) {
        return res.status(400).json({ error: "Incorrect email or password" });
      }

      const cookie = createLoggedInCookie(email);
      user.loggedInCookie = cookie;
      await user.save();

      res
        .status(200)
        .cookie(COOKIE_USER_ID, cookie, {
          maxAge: _1month,
          sameSite: "lax",
          domain: "127.0.0.1",
        })
        .json(stringifyUser(user));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createUser: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        phoneNo,
        studentStatus,
        studentRegistrationNumber,
      } = req.body;

      if (
        !name ||
        !email ||
        !password ||
        !studentStatus ||
        typeof email !== "string"
      ) {
        return res
          .status(400)
          .json({ error: "One or more required fields are left empty" });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const cookie = createLoggedInCookie(email);

      let profileImage = null;
      if (req.file) {
        profileImage = req.file.buffer.toString("base64");
      }

      const user = await User.create({
        email: email.toLowerCase(),
        passwordHash,
        name,
        phoneNo,
        profileImage, // Base64 image or null
        loggedInCookie: cookie,
        studentStatus,
        studentRegistrationNumber,
      });

      res
        .status(201)
        .cookie(COOKIE_USER_ID, cookie, {
          maxAge: _1month,
          sameSite: "lax",
          domain: "127.0.0.1",
        })
        .json(stringifyUser(user));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const cookies = req.cookies;
      if (!cookies || !cookies[COOKIE_USER_ID]) {
        return res.status(404).json({ error: "No current user" });
      }

      const userCookie = cookies[COOKIE_USER_ID];
      const user = await User.findOne({ loggedInCookie: userCookie });

      if (!user) {
        return res.status(404).json({ error: "No user found" });
      }

      res.status(200).json(stringifyUser(user));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  logout: async (req, res) => {
    try {
      const cookies = req.cookies;
      if (!cookies || !cookies[COOKIE_USER_ID]) {
        return res.status(200).json({ message: "Not logged in" });
      }

      const userCookie = cookies[COOKIE_USER_ID];
      const user = await User.findOne({ loggedInCookie: userCookie });

      if (user) {
        user.loggedInCookie = undefined;
        await user.save();
      }

      res.status(200).clearCookie(COOKIE_USER_ID).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Fetch the user's profile image by ID
  getProfileImage: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);

      if (user && user.profileImage) {
        const base64Image = user.profileImage[0]; // Assuming the first image if multiple
        const imgBuffer = Buffer.from(base64Image, "base64");
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(imgBuffer);
      } else {
        res.status(404).json({ error: "Image not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { name, email, phoneNo, studentStatus, studentRegistrationNumber } =
        req.body;

      const updates = {};

      if (name) updates.name = name;
      if (email) updates.email = email.toLowerCase();
      if (phoneNo) updates.phoneNo = phoneNo;
      if (studentStatus) updates.studentStatus = studentStatus;
      if (studentRegistrationNumber)
        updates.studentRegistrationNumber = studentRegistrationNumber;

      // Handle profile image upload
      if (req.file) {
        updates.profileImage = req.file.buffer.toString("base64");
      }

      // Ensure at least one field is being updated
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No update fields provided" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user information
      Object.assign(user, updates);
      await user.save();

      res.status(200).json(stringifyUser(user));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
