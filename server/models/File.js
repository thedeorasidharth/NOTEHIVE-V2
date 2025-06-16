const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  files: { type: String, required: true },
  uploaderEmail: { type: String, required: true },
  comments: [
    {
      userEmail: String,
      comment: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  ratings: [Number],
  downloads: { type: Number, default: 0 },
});

module.exports = mongoose.model("File", fileSchema);
