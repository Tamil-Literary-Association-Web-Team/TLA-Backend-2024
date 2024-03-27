const mongoose = require("mongoose");
const SharedMemory = require("../models/sharedMemoryModel");
const { url } = require("../../config/config");
const { Readable } = require("stream");
const { COOKIE_USER_ID, userImageUrl } = require("./userController");
const User = require("../models/userModel");

const MEMORIES_IMAGES_BUCKET_NAME = "memories_images";

/**
 * @type {mongoose.mongo.GridFSBucket}
 */
let gridFsBucket;
const connection = mongoose.connection;

connection.once("open", () => {
	gridFsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
		bucketName: MEMORIES_IMAGES_BUCKET_NAME
	})
})

module.exports = {
	getAllSharedMemories: async (req, res) => {
		try {
			const sharedMemories = await SharedMemory.find();

			const stringifiedMemories = new Array(sharedMemories.length);

			await Promise.all(sharedMemories.map(async (memory, i) => {
				const sharedByUserId = memory.sharedBy;
				const sharedByUser = await User.findById(sharedByUserId);

				if (!sharedByUser) return;

				stringifiedMemories[i] = {
					_id: memory.id,
					heading: memory.heading,
					content: memory.content,
					sharedBy: {
						name: sharedByUser.name,
						email: sharedByUser.email,
						profileImageUrl: userImageUrl(sharedByUser.profileImageId),
					},
					images: memory.images.map(id => `${url}/shared-memories/image/${id}`)
				}
			}));

			res.status(200).json(stringifiedMemories);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	},
	createMemory:
		/**
		 * @param {import("express").Request} req
		 * @param {import("express").Response} res
		 */
		async (req, res) => {
			try {
				// const { name, email, password, phoneNo } = req.body;
				const { title, description } = req.body;
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
					res.status(401).json({ error: "Not authorized" });
					return;
				}

				const images = req.files;
				if (!Array.isArray(images)) {
					console.log("not array", images);
					res.status(300).json({ error: "Internal error occured" });
					return;
				}

				const promises = images.map(
					(image) => new Promise(
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
						}));
				const imagesId = await Promise.all(promises);

				const memoryItem = SharedMemory.create({
					heading: title,
					content: description,
					sharedBy: user.id,
					images: imagesId
				})

				res.status(200).json(memoryItem)
			} catch (error) {
				console.error(error);
				res.status(500).json({ error: "Internal Server Error" });
			}
		},
	getImage:
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

			const files = gridFsBucket.find({});
			const d = new mongoose.Types.ObjectId(fileId);

			let imageFile = undefined;
			for await (const doc of files) {
				if (doc._id.toString() == d.toString()) {
					imageFile = doc;
					break;
				}
			}

			if (imageFile == undefined) {
				res.status(404).json({ error: "No such image exists" });
				return;
			}

			res.status(200);
			gridFsBucket.openDownloadStream(imageFile._id).pipe(res);
		}
}