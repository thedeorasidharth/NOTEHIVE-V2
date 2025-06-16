const Notes = require("../models/Notes");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { extractTextFromPDF } = require("../utils/pdfUtils");

// Truncate helper
function truncateText(text, maxWords = 800) {
  return text.split(" ").slice(0, maxWords).join(" ");
}

// Hugging Face Summarizer
async function generateSummary(text) {
  try {
    const truncated = truncateText(text);

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: truncated },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data?.[0]?.summary_text;
    if (!summary) throw new Error("No summary_text returned");

    console.log("✅ HuggingFace summary used.");
    return summary;
  } catch (err) {
    console.error("❌ HuggingFace summarization failed:", err.message);
    return text.slice(0, 150) + "...";
  }
}

// Upload Note
// controllers/NotesController.js
const uploadNote = async (req, res) => {
  try {
    const { fileName, fileDescription, subject, tags } = req.body;
    if (!req.file) return res.status(400).json({ error: "PDF file is required." });

    const pdfText = await extractTextFromPDF(req.file.path);
    if (!pdfText) return res.status(400).json({ error: "PDF text extraction failed." });

    const summary = await generateSummary(pdfText || fileDescription);

    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newNote = new Notes({
      fileName,
      fileDescription,
      summary,
      subject,
      tags,
      files: req.file.filename,
      uploadedBy: decoded.userId,
      bookmarkedBy: [], // Explicitly initialize
      ratings: [], // Explicitly initialize
      comments: [], // Explicitly initialize
    });

    await newNote.save();
    res.status(201).json({ message: "Note uploaded successfully!", summary });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get Notes (Search)
// controllers/NotesController.js
const getNote = async (req, res) => {
  try {
    const { title, tag } = req.query;
    const query = {};
    if (title) query.fileName = { $regex: title, $options: "i" };
    if (tag) query.tags = { $regex: tag, $options: "i" };

    const data = await Notes.find(query)
      .populate("uploadedBy", "name")
      .populate("comments.userId", "name")
      .populate("bookmarkedBy", "_id"); // Add this

    res.status(200).json({ data });
  } catch (error) {
    console.error("Get Notes Error:", error);
    res.status(500).json({ error: "Error fetching notes." });
  }
};

// Get Notes by User ID
const getNoteByID = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = await Notes.find({ uploadedBy: userId })
      .populate("uploadedBy", "name")
      .populate("comments.userId", "name");

    res.status(200).json({ data });
  } catch (error) {
    console.error("Get Notes by ID Error:", error);
    res.status(500).json({ error: "Error fetching user's notes." });
  }
};

// Add Comment
const addComment = async (req, res) => {
  try {
    const { noteId, text } = req.body;
    const userId = req.user?.id;

    if (!noteId || !text || !userId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const note = await Notes.findById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found." });

    note.comments.push({ userId, text });
    await note.save();

    res.status(200).json({ message: "Comment added successfully." });
  } catch (error) {
    console.error("Add Comment Error:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
};

// Summarize Note
const summarizeNote = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "PDF file required" });

    const pdfText = await extractTextFromPDF(req.file.path);
    if (!pdfText) return res.status(400).json({ error: "Failed to extract PDF text" });

    const summary = await generateSummary(pdfText);
    res.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({ error: "Failed to summarize" });
  }
};

module.exports = {
  uploadNote,
  getNote,
  getNoteByID,
  addComment,
  summarizeNote,
};
