"use strict";
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')

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
// const path = require('path');

// Parse JSON requests
// app.use(express.json());

// app.use(express.static(path.join(__dirname, '/build')));
// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname + '/build/index.html'));
// });

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/contacts", contactRoutes);
app.use("/aramiyams", aramiyamRoutes);
app.use("/districts", districtRoutes);
app.use("/schools", schoolRoutes);
app.use("/brammams", brammamRoutes);
app.use("/users", userRoutes);
app.use("/shared-memories", sharedMemoryRoutes)
app.use("/sotkanais", sotkanaiRoutes);
app.use("/ideathon", ideathonRoutes);
app.use("/ideathon-rules", ideathonRuleRoutes);
app.use("/books", bookRoutes);

module.exports = app;
