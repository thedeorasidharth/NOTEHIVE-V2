import React, { useState } from "react";
import axios from "axios";

const UploadNotes = () => {
  const [fileName, setFileName] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!fileName || !fileDescription || !subject || !tags || !file) {
      setMessage("Please fill all fields and select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("fileName", fileName);
    formData.append("fileDescription", fileDescription);
    formData.append("subject", subject);
    formData.append("tags", tags);
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post("http://localhost:4000/notes/upload", formData, config);

      setMessage("Note uploaded successfully!");
      setFileName("");
      setFileDescription("");
      setSubject("");
      setTags("");
      setFile(null);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Upload failed. Try again.");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Upload Notes
      </h2>
      <form onSubmit={handleUpload} className="space-y-5">
        <input
          type="text"
          placeholder="Title"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          placeholder="Description"
          value={fileDescription}
          onChange={(e) => setFileDescription(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <label
          htmlFor="file-upload"
          className="w-full border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition"
        >
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          {!file ? (
            <p className="text-gray-500">Drag & drop or click to upload a PDF</p>
          ) : (
            <p className="text-green-600 font-medium">Selected: {file.name}</p>
          )}
        </label>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md hover:from-purple-600 hover:to-pink-600 transition"
        >
          Upload
        </button>
        {message && (
          <p className="text-center mt-4 text-sm font-medium text-blue-700">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadNotes;
