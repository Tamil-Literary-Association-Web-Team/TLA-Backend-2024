const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const COOKIE_USER_ID = "uid";
const _1month = 864000000;
const SALT_ROUNDS = 11;

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

module.exports = {
	getAllUsers: async (req, res) => {
		try {
			const users = await User.find();
			res.status(200).json(users);
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
				res.status(200).json(user);
			} else {
				res.status(404).json({ message: "User not found" });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	},
	createUser: async (req, res) => {
		try {
			const newUser = await User.create(req.body);
			res.status(201).json(newUser);
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
			console.log(user);
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
				}).json({
					passwordHash: null,
					...user
				});
			return;
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	},
	createUser: async (req, res) => {
		try {
			const { name, email, password, phoneNo } = req.body;
			console.log(req.body);
			if (!name || !email || !password || typeof email != "string") {
				res.status(400).json({ error: "one or more required fields are left empty" });
				return;
			}

			const _alreadyExists = await User.find({
				email: email.toLowerCase()
			})

			if (_alreadyExists) {
				res.status(400).json({ error: "already user exists" })
				return;
			}

			const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
			const cookie = createLoggedInCookie(email);
			console.log("cookie", cookie, "for", email);

			const user = await User.create({
				email: email.toLowerCase(),
				passwordHash,
				name,
				phoneNo,
				loggedInCookie: cookie
			});

			res.status(201)
				.cookie(COOKIE_USER_ID, cookie, {
					maxAge: _1month,
					sameSite: "lax",
					domain: "127.0.0.1",
				}).json({ passwordHash: null, ...user });
			return;
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
}