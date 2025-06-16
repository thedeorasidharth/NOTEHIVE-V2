import axios from "axios";
import React, { useState } from "react";
import { FaSearch, FaStar, FaCopy, FaBookmark } from "react-icons/fa";
import { useSelector } from "react-redux";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState({});
  const [submittedRatings, setSubmittedRatings] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [summaries, setSummaries] = useState({});
  const [loadingSummaryId, setLoadingSummaryId] = useState(null);
  const [bookmarks, setBookmarks] = useState({});

  const user = useSelector((state) => state.user.userData);
  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");

  const getAverageRating = (note) => {
    if (!note.ratings?.length) return 0;
    const total = note.ratings.reduce((sum, r) => sum + r.rating, 0);
    return (total / note.ratings.length).toFixed(1);
  };

 // SearchBar.jsx
const handleSearch = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const res = await axios.get("http://localhost:4000/notes/getFiles", {
      params: { title: searchQuery },
    });

    const results = res.data.data;

    const ratingsObj = {};
    const submittedObj = {};
    const commentObj = {};
    const bookmarkObj = {};

    results.forEach((note) => {
      const userRating = note.ratings?.find(
        (r) =>
          r.userId === user?._id ||
          (r.userId?._id && r.userId._id === user?._id)
      );
      ratingsObj[note._id] = userRating?.rating || 0;
      submittedObj[note._id] = Boolean(userRating);
      commentObj[note._id] = note.comments || [];
      // Convert ObjectIDs to strings for comparison
      bookmarkObj[note._id] = note.bookmarkedBy?.some(
        (u) => u._id.toString() === user?._id
      ) || false;
    });

    setRatings(ratingsObj);
    setSubmittedRatings(submittedObj);
    setComments(commentObj);
    setBookmarks(bookmarkObj);
    setSearchResults(results);
    setSearchStatus(results.length ? "Found" : "Not-Found");
  } catch (error) {
    console.error("Error fetching notes:", error);
    setSearchStatus("Error");
  } finally {
    setIsLoading(false);
  }
};

  const showPDF = (filePath) => {
    window.open(`http://localhost:4000/files/${filePath}`, "_blank");
  };

  const handleRatingChange = (noteId, value) => {
    if (submittedRatings[noteId]) return;
    setRatings((prev) => ({ ...prev, [noteId]: value }));
  };

  const submitRating = async (noteId) => {
    const rating = ratings[noteId];
    if (!rating) return;

    try {
      await axios.post(
        "http://localhost:4000/notes/rate",
        { noteId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmittedRatings((prev) => ({ ...prev, [noteId]: true }));
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleCommentChange = (noteId, text) => {
    setNewComments((prev) => ({ ...prev, [noteId]: text }));
  };

  const submitComment = async (noteId) => {
    const comment = newComments[noteId];
    if (!comment) return;

    try {
      await axios.post(
        "http://localhost:4000/notes/comment",
        { noteId, text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => ({
        ...prev,
        [noteId]: [
          ...(prev[noteId] || []),
          { text: comment, userId: user },
        ],
      }));
      setNewComments((prev) => ({ ...prev, [noteId]: "" }));
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const fetchSummary = async (noteId, filePath) => {
    setLoadingSummaryId(noteId);
    try {
      const response = await axios.get(
        `http://localhost:4000/files/${filePath}`,
        { responseType: "blob" }
      );

      const file = new File([response.data], filePath, {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("file", file);

      const summaryResponse = await axios.post(
        "http://localhost:4000/notes/summarize",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummaries((prev) => ({
        ...prev,
        [noteId]:
          summaryResponse.data.summary || "No summary available",
      }));
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummaries((prev) => ({
        ...prev,
        [noteId]: "Failed to generate summary",
      }));
    } finally {
      setLoadingSummaryId(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

 // SearchBar.jsx
const toggleBookmark = async (noteId) => {
  try {
    const res = await axios.post(
      "http://localhost:4000/notes/toggleBookmark",
      { noteId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setBookmarks((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
    // Optional: Show success message
    alert("Bookmark toggled successfully!");
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    alert("Failed to toggle bookmark. Please try again.");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 dark:bg-gray-900">
      <form
        className="mx-auto mb-8 flex max-w-xl items-center gap-4 rounded-xl border border-gray-400 bg-white px-4 py-2 shadow-md dark:bg-[#1f2937]"
        onSubmit={handleSearch}>
        <FaSearch className="text-xl text-gray-700 dark:text-white" />
        <input
          type="search"
          placeholder="Search for Notes"
          className="flex-1 bg-transparent px-2 py-1 text-black outline-none dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Search
        </button>
      </form>

      {isLoading && <div className="text-center">Loading...</div>}

      {searchStatus === "Found" && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {searchResults.map((note) => (
            <div
              key={note._id}
              className="rounded-lg bg-white p-4 shadow-md dark:bg-[#1f2937] dark:text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{note.fileName}</h2>
                <FaBookmark
                  className={`cursor-pointer text-xl ${
                    bookmarks[note._id] ? "text-yellow-400" : "text-gray-400"
                  }`}
                  onClick={() => toggleBookmark(note._id)}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {note.fileDescription}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Subject:</span> {note.subject}
              </p>
              <p className="text-sm">
                <span className="font-medium">Tags:</span> {note.tags}
              </p>
              <div className="mt-2 text-sm font-medium text-yellow-500">
                Avg. Rating: {getAverageRating(note)} ⭐
              </div>

              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => showPDF(note.files)}
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">
                  View PDF
                </button>
                <button
                  onClick={async () => {
                    try {
                      await axios.post(
                        `http://localhost:4000/notes/download/${note._id}`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                      );

                      const link = document.createElement("a");
                      link.href = `http://localhost:4000/notes/download-file/${note.files}`;
                      link.download = note.fileName;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } catch (err) {
                      console.error("Download failed:", err);
                    }
                  }}
                  className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">
                  Download
                </button>
              </div>

              <div className="mt-4">
                <p className="mb-1 text-sm font-medium">Rate this note:</p>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer text-xl ${
                        (ratings[note._id] || 0) >= star
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                      onClick={() => handleRatingChange(note._id, star)}
                    />
                  ))}
                </div>
                <button
                  onClick={() => submitRating(note._id)}
                  className={`mt-2 rounded px-3 py-1 text-sm font-medium ${
                    submittedRatings[note._id]
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                  disabled={submittedRatings[note._id]}>
                  {submittedRatings[note._id] ? "Rated!" : "Submit Rating"}
                </button>
              </div>

              <div className="mt-4">
                <p className="mb-1 text-sm font-medium">Comments:</p>
                <div className="space-y-1 text-sm max-h-28 overflow-y-auto">
                  {comments[note._id]?.map((c, idx) => (
                    <p key={idx}>• {c.text}</p>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    value={newComments[note._id] || ""}
                    onChange={(e) =>
                      handleCommentChange(note._id, e.target.value)
                    }
                    placeholder="Write a comment"
                    className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    onClick={() => submitComment(note._id)}
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
                    Add
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <button
                  className="rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700"
                  onClick={() => fetchSummary(note._id, note.files)}
                  disabled={loadingSummaryId === note._id}>
                  {loadingSummaryId === note._id
                    ? "Summarizing..."
                    : "Summarize Note"}
                </button>

                {summaries[note._id] && (
                  <div className="mt-2 bg-gray-200 p-2 text-sm text-black rounded dark:bg-gray-800 dark:text-white">
                    <p className="mb-1 font-medium">Summary:</p>
                    <p>{summaries[note._id]}</p>
                    <button
                      className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      onClick={() => copyToClipboard(summaries[note._id])}>
                      <FaCopy /> Copy to Clipboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {searchStatus === "Not-Found" && (
        <div className="text-center">No notes found.</div>
      )}
      {searchStatus === "Error" && (
        <div className="text-center text-red-500">Error fetching notes.</div>
      )}
    </div>
  );
};

export default SearchBar;
