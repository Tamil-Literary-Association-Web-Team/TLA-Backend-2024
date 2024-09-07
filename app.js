"use strict";
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const contactRoutes = require("./api/routes/contactRoutes");
const aramiyamRoutes = require("./api/routes/aramiyamRoutes");
const districtRoutes = require("./api/routes/districtRoutes");
const schoolRoutes = require("./api/routes/schoolRoutes");
const brammamRoutes = require("./api/routes/brammamRoutes");
const userRoutes = require("./api/routes/userRoutes");
const sharedMemoryRoutes = require("./api/routes/sharedMemoryRoutes");
const sotkanaiRoutes = require("./api/routes/sotkanaiRoutes");
const ideathonRoutes = require("./api/routes/ideathonRoutes");
const ideathonRuleRoutes = require("./api/routes/ideathonRuleRoutes");
const bookRoutes = require("./api/routes/bookRoutes");

const app = express();
const path = require("path");

// // Configure CORS
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Allow requests from this origin
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true, // Allow cookies to be sent and received
//   })
// );

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
// const buildPath = require("../TLA-Backend-2024/build");

app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     res.send('TLA UOM')
//   })

// Routes
app.use("/api/contacts", contactRoutes);
app.use("/api/aramiyams", aramiyamRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/brammams", brammamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shared-memories", sharedMemoryRoutes);
app.use("/api/sotkanais", sotkanaiRoutes);
app.use("/api/ideathon", ideathonRoutes);
app.use("/api/ideathon-rules", ideathonRuleRoutes);
app.use("/api/books", bookRoutes);

// app.use(express.static(path.join(__dirname, "/build")));
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/build/index.html"));
// });

module.exports = app;
