const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
require('./config/db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
let UserRouter;
let noteRoutes;

try {
  UserRouter = require('./api/User');
  app.use('/user', UserRouter);
} catch (error) {
  console.error("Error loading User routes:", error);
}

try {
  noteRoutes = require("./Routes/Notes");
  app.use("/notes", noteRoutes);
} catch (error) {
  console.error("Error loading Notes routes:", error);
}

// Serve uploaded files
app.use("/files", express.static(path.join(__dirname, "files")));

// Root route
app.get('/', (req, res) => {
  res.send("Hello from server");
});

// Test route
app.get('/test', (req, res) => {
  res.send("Test route working!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});