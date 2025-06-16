import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  FaUser,
  FaFileUpload,
  FaFileAlt,
  FaPhone,
  FaEnvelope,
  FaBirthdayCake,
  FaBookmark,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const Profile = () => {
  const user = useSelector((state) => state.user.userData);
  const [userFiles, setUserFiles] = useState([]);
  const [bookmarkedFiles, setBookmarkedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserFiles = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/notes/getFiles/${user._id}`
      );
      setUserFiles(res.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

 // Profile.jsx
// Profile.jsx
const getBookmarkedFiles = async () => {
  try {
    const token = localStorage.getItem("token"); // Or get from Redux
    const res = await axios.get(
      `http://localhost:4000/notes/getBookmarkedNotes/${user._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setBookmarkedFiles(res.data.data);
  } catch (err) {
    console.error("Error fetching bookmarked notes", err);
    setError("Failed to fetch bookmarked notes. Please try again.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (user?._id) {
      getUserFiles();
      getBookmarkedFiles();
    }
  }, [user]);

  const averageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, r) => sum + r, 0);
    return (total / ratings.length).toFixed(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading || !user)
    return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6fa] to-[#e9efff] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-40 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-14 w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow-xl overflow-hidden">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              ) : (
                <FaUser className="text-gray-400 text-5xl" />
              )}
            </div>
          </div>

          <div className="px-6 pt-20 pb-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600 text-sm">
                @{user.email?.split("@")[0]}
              </p>
              <p className="mt-2 text-gray-600 max-w-xl mx-auto">
                {user.bio || "No bio added yet. Click edit to add one."}
              </p>
              <button className="mt-4 px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition">
                <MdEdit className="inline mr-2" />
                Edit Profile
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-purple-500" /> {user.email}
              </div>
              {user.mobile && (
                <div className="flex items-center gap-2">
                  <FaPhone className="text-purple-500" /> {user.mobile}
                </div>
              )}
              <div className="flex items-center gap-2">
                <FaBirthdayCake className="text-purple-500" />{" "}
                {formatDate(user.dob)}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-xl shadow">
                <div className="flex items-center gap-4">
                  <FaFileUpload className="text-3xl text-pink-600" />
                  <div>
                    <p className="text-gray-500">Total Uploads</p>
                    <p className="text-2xl font-semibold">{userFiles.length}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl shadow">
                <div className="flex items-center gap-4">
                  <FaBookmark className="text-3xl text-purple-600" />
                  <div>
                    <p className="text-gray-500">Total Bookmarks</p>
                    <p className="text-2xl font-semibold">
                      {bookmarkedFiles.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Notes Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                My Uploaded Notes
              </h3>
              {userFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userFiles.map((file) => (
                    <div
                      key={file._id}
                      className="border rounded-xl p-4 bg-white hover:shadow-md transition">
                      <h4 className="font-semibold text-lg truncate mb-1">
                        {file.fileName}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        Type: {file.fileType || "PDF"}
                      </p>
                      <a
                        href={`http://localhost:4000/files/${file.files}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline text-sm">
                        View/Download
                      </a>
                      <div className="mt-3 flex justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          {averageRating(file.ratings)} (
                          {file.ratings?.length || 0})
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">💬</span>
                          {file.comments?.length || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <FaFileAlt className="mx-auto text-5xl text-gray-400 mb-4" />
                  <p className="text-lg font-medium">No notes uploaded yet</p>
                  <p className="text-sm">Start by uploading your first note!</p>
                </div>
              )}
            </div>

            {/* Bookmarked Notes Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                My Bookmarked Notes
              </h3>
              {bookmarkedFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedFiles.map((file) => (
                    <div
                      key={file._id}
                      className="border rounded-xl p-4 bg-white hover:shadow-md transition">
                      <h4 className="font-semibold text-lg truncate mb-1">
                        {file.fileName}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        Type: {file.fileType || "PDF"}
                      </p>
                      <a
                        href={`http://localhost:4000/files/${file.files}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline text-sm">
                        View/Download
                      </a>
                      <div className="mt-3 flex justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          {averageRating(file.ratings)} (
                          {file.ratings?.length || 0})
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">💬</span>
                          {file.comments?.length || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <FaBookmark className="mx-auto text-5xl text-gray-400 mb-4" />
                  <p className="text-lg font-medium">
                    No notes bookmarked yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
