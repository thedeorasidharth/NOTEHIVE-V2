const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const NotesController = require("../controllers/NotesController");
const verifyToken = require("../middleware/auth");
const Notes = require("../models/Notes");
const User = require("../models/User");

// File storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
router.post("/upload", verifyToken, upload.single("file"), NotesController.uploadNote);
console.log("Registered POST /upload");

router.get("/getFiles", NotesController.getNote);
console.log("Registered GET /getFiles");

router.get("/getFiles/:id", NotesController.getNoteByID);
console.log("Registered GET /getFiles/:id");

router.post("/comment", verifyToken, NotesController.addComment);
console.log("Registered POST /comment");

router.post("/summarize", verifyToken, upload.single("file"), NotesController.summarizeNote);
console.log("Registered POST /summarize");

router.post("/rate", verifyToken, async (req, res) => {
  try {
    const { noteId, rating } = req.body;
    const userId = req.user.id;
    const note = await Notes.findById(noteId);
    if (!note) return res.status(404).json({ msg: "Note not found" });
    const existingRating = note.ratings.find((r) => r.userId.toString() === userId);
    if (existingRating) {
      return res.status(400).json({ msg: "You have already rated this note." });
    }
    note.ratings.push({ userId, rating });
    await note.save();
    res.json({ msg: "Rating submitted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
console.log("Registered POST /rate");

router.get("/getRating/:noteId", verifyToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;
    const note = await Notes.findById(noteId);
    if (!note) return res.status(404).json({ msg: "Note not found" });
    const existingRating = note.ratings.find((r) => r.userId.toString() === userId);
    if (existingRating) {
      res.json({ hasRated: true, rating: existingRating.rating });
    } else {
      res.json({ hasRated: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
console.log("Registered GET /getRating/:noteId");

router.post("/toggleBookmark", verifyToken, async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.userId; // Fix: Use req.user.userId instead of req.user.id
    console.log("noteId:", noteId);
    console.log("userId:", userId);

    const note = await Notes.findById(noteId);
    console.log("Note:", note);
    const user = await User.findById(userId);
    console.log("User:", user);

    if (!note || !user) return res.status(404).json({ message: "Not found" });

    const isBookmarked = note.bookmarkedBy.includes(userId);
    console.log("isBookmarked:", isBookmarked);

    if (isBookmarked) {
      note.bookmarkedBy.pull(userId);
      user.bookmarks.pull(noteId);
    } else {
      note.bookmarkedBy.push(userId);
      user.bookmarks.push(noteId);
    }

    await note.save();
    await user.save();

    res.status(200).json({ message: "Bookmark toggled" });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ message: "Server error" });
  }
});
console.log("Registered POST /toggleBookmark");

router.get("/download-file/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../files", req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("File not found");
    }
    res.download(filePath, req.params.filename);
  });
});
console.log("Registered GET /download-file/:filename");

router.get("/getBookmarkedNotes/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate({
      path: "bookmarks",
      populate: [
        { path: "uploadedBy", select: "name" },
        { path: "comments.userId", select: "name" },
      ],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: user.bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarked notes:", error);
    res.status(500).json({ message: "Server error" });
  }
});
console.log("Registered GET /getBookmarkedNotes/:userId");

module.exports = router;