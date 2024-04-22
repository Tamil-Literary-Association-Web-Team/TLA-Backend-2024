"use strict";
const http = require("http");
const app = require("./app");
const mongoose = require("./db/db");

const port = process.env.PORT || 3001;
const server = http.createServer(app);

// Start the server after successfully connecting to MongoDB
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/api/`);
});

// Handle server errors
server.on("error", (err) => {
  console.error("Server error:", err);
});
