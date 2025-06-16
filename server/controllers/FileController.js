const File = require("../models/File");
const path = require("path");

const downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) return res.status(404).json({ error: "File not found" });

    // ✅ Increment download count
    file.downloads += 1;
    await file.save();

    const filePath = path.join(__dirname, "../uploads", file.files); // Adjust if needed
    res.download(filePath, file.fileName);
  } catch (err) {
    console.error("Download Error:", err);
    res.status(500).json({ error: "Failed to download file" });
  }
};

module.exports = {
  downloadFile,
};
