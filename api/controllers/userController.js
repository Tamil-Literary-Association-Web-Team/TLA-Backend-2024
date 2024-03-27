const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { Readable } = require("stream");
const { url } = require("../../config/config");

const USER_PROFILE_IMAEGS_BUCKET_NAME = "user_profile_images";

const COOKIE_USER_ID = "uid";
const _1month = 864000000;
const SALT_ROUNDS = 11;

/**
 * @type {mongoose.mongo.GridFSBucket}
 */
let gridFsBucket;
const connection = mongoose.connection;

connection.once("open", () => {
	gridFsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
		bucketName: USER_PROFILE_IMAEGS_BUCKET_NAME
	})
});

/**
 * @param {string} email
 */
function createLoggedInCookie(email) {
	if (typeof email != "string") {
		return ""
	}

	const hash = crypto.createHash("sha1");
	const hashKey = email.concat("--", new Date().toISOString());
	hash.update(hashKey);
	return hash.digest("hex");
}

/**
 * @param {string} profileImageId
 */
function userImageUrl(profileImageId) {
	return `${url}/users/image/${profileImageId || "not-found"}`;
}

function stringifyUser(user) {
	return {
		_id: user._id,
		email: user.email,
		name: user.name,
		phoneNo: user.phoneNo,
		profileImageUrl: userImageUrl(user.profileImageId)
	}
}

module.exports = {
	COOKIE_USER_ID,
	userImageUrl,
	getAllUsers: async (req, res) => {
		try {
			const users = await User.find();
			const stringifiedUsers = new Array(users.length);

			for (let i = 0; i < users.length; i++) {
				const user = users[i];
				stringifiedUsers[i] = stringifyUser(user);
			}

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
			if (!email || !password || typeof email != "string") {
				res.status(400).json({ error: "email or password is not provided" });
				return;
			}

			const user = await User.findOne({
				email: email.toLowerCase()
			});
			if (!user) {
				res.status(400).json({ error: "Incorrect email or password" });
				return;
			}
			const isCorrect = await bcrypt.compare(password, user.passwordHash);

			if (!isCorrect) {
				res.status(400).json({ error: "Incorrect email or password" });
				return;
			}

			const cookie = createLoggedInCookie(email);
			user.loggedInCookie = cookie;
			console.log("cookie", cookie, "for", email);
			await user.save();

			res.status(200)
				.cookie(COOKIE_USER_ID, cookie, {
					maxAge: _1month,
					sameSite: "lax",
					domain: "127.0.0.1",
				}).json(stringifyUser(user));
			return;
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	},
	createUser:
		/**
		 * @param {import("express").Request} req
		 * @param {import("express").Response} res
		 */
		async (req, res) => {
			try {
				const { name, email, password, phoneNo } = req.body;
				if (!name || !email || !password || typeof email != "string") {
					res.status(400).json({ error: "one or more required fields are left empty" });
					return;
				}

				const _alreadyExists = await User.findOne({
					email: email.toLowerCase()
				})

				if (_alreadyExists) {
					res.status(400).json({ error: "already user exists" })
					return;
				}

				const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
				const cookie = createLoggedInCookie(email);
				console.log("cookie", cookie, "for", email);

				/**
				 * @type {Express.Multer.File | undefined}
				 */
				const image = req.file;
				let profileImageId = undefined;
				if (image) {
					profileImageId = await new Promise(
						(resolve, reject) => {
							const readStream = new Readable({
								read() {
									this.push(image.buffer);
									this.push(null);
								}
							});
							const uploadStream = gridFsBucket.openUploadStream(image.filename)
							const piped = readStream.pipe(
								uploadStream
							);
							piped.on("close", resolve.bind(null, uploadStream.id.toString()));
							piped.on("error", reject);
						});
				}

				const user = await User.create({
					email: email.toLowerCase(),
					passwordHash,
					name,
					phoneNo,
					profileImageId,
					loggedInCookie: cookie
				});

				res.status(201)
					.cookie(COOKIE_USER_ID, cookie, {
						maxAge: _1month,
						sameSite: "lax",
						domain: "127.0.0.1",
					}).json({
						name: user.name,
						email: user.email,
						phoneNo: user.phoneNo,
						profileUrl: user.profileImageId
					});
				return;
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: "Internal Server Error" });
			}
		},
	getCurrentUser: async (req, res) => {
		try {
			const cookies = req.cookies;
			if (!cookies || !cookies[COOKIE_USER_ID]) {
				res.status(404).json({ error: "no current user" });
				return;
			}

			const userCookie = cookies[COOKIE_USER_ID];
			const user = await User.findOne({
				loggedInCookie: userCookie
			});

			if (!user) {
				res.status(404).json({ error: "no user found" })
				return;
			}

			res.status(200).json(stringifyUser(user));
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	},
	logout:
		/**
		 * @type {import("express").RequestHandler}
		 */
		async (req, res) => {
			try {
				const cookies = req.cookies;
				if (!cookies || !cookies[COOKIE_USER_ID]) {
					res.status(200).json({ message: "not logged in" });
					return;
				}
				const userCookie = cookies[COOKIE_USER_ID];
				const user = await User.findOne({
					loggedInCookie: userCookie
				});

				if (!user) {
					res.status(200).json({ message: "no user found" })
					return;
				}

				user.loggedInCookie = undefined;
				await user.save();

				res.status(200).clearCookie(COOKIE_USER_ID).send();
				return;
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: "Internal Server Error" });
			}
		},
	getProfileImage:
		/**
		 * @param {import("express").Request} req
		 * @param {import("express").Response} res
		 */
		async (req, res) => {
			const fileId = req.params.id;

			if (typeof fileId != "string") {
				res.status(404).json({ error: "Invalid image id" });
				return;
			}

			if (fileId == "not-found") {
				res.status(200);
				fs.createReadStream("assets/user-mock-image.png").pipe(res);
				return;
			}

			const files = gridFsBucket.find({});
			const d = new mongoose.Types.ObjectId(fileId);

			let imageFile = undefined;
			for await (const doc of files) {
				if (doc._id.toString() == d.toString()) {
					imageFile = doc;
					break;
				}
			}

			res.status(200);
			if (imageFile == undefined) {
				fs.createReadStream("assets/user-mock-image.png").pipe(res);
				return;
			}
			gridFsBucket.openDownloadStream(imageFile._id).pipe(res);
		}
}