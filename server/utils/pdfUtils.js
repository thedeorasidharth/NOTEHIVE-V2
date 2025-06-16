const pdf = require("pdf-parse");
const fs = require("fs");

async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (err) {
    console.error("PDF Extract Error:", err.message);
    return "";
  }
}

module.exports = { extractTextFromPDF };
