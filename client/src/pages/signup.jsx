import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/slices/user-slice";

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        mobile: "",
        bio: "",
        email: "",
        username: "",
        password: "",
        dob: "",
    });

    const [profileImage, setProfileImage] = useState(null);
    const [profilePreviewImage, setProfilePreviewImage] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
        else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Mobile number must be 10 digits";

        if (!formData.bio.trim()) newErrors.bio = "Bio is required";

        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";

        if (!formData.username.trim()) newErrors.username = "Username is required";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";

        if (!formData.dob.trim()) newErrors.dob = "Date of birth is required";

        if (!profileImage) newErrors.profileImage = "Profile image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });
            data.append("profileImage", profileImage);

            const response = await axios.post("http://localhost:4000/user/signup", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.status === "PENDING") {
                // Dispatch Redux action
                dispatch(setUserData({
                    user: response.data.user,
                    token: null, // If backend sends token, update here
                }));

                alert("Verification email sent! Please check your inbox.");
                navigate("/verify-otp");
            } else {
                alert(response.data.message || "Registration successful!");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                    Create Your Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`mt-1 w-full border ${
                                errors.firstName ? "border-red-500" : "border-gray-300"
                            } rounded-md p-2`}
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm">{errors.firstName}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`mt-1 w-full border ${
                                errors.lastName ? "border-red-500" : "border-gray-300"
                            } rounded-md p-2`}
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm">{errors.lastName}</p>
                        )}
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-sm font-medium">Mobile Number</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className={`mt-1 w-full border ${
                                errors.mobile ? "border-red-500" : "border-gray-300"
                            } rounded-md p-2`}
                        />
                        {errors.mobile && (
                            <p className="text-red-500 text-sm">{errors.mobile}</p>
                        )}
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className={`mt-1 w-full border ${
                                errors.bio ? "border-red-500" : "border-gray-300"
                            } rounded-md p-2`}
                        />
                        {errors.bio && (
                            <p className="text-red-500 text-sm">{errors.bio}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`mt-1 w-full border ${
                                errors.email ? "border-red-500" : "border-gray-300"
                            } rounded-md p-2`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`mt-1 w-full border ${
                                errors.username ? "border-red-500" : "border-gray-300"
                            } rounded-md p-2`}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm">{errors.username}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`mt-1 w-full border ${
                                errors.password ? "border-red-500" : "border-gray-300"
                            } rounded-md p-2`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                    </div>

                    {/* DOB */}
                    <div>
                        <label className="block text-sm font-medium">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className={`mt-1 w-full border ${
                                errors.dob ? "border-red-500" : "border-gray-300"
                            } rounded-md p-2`}
                        />
                        {errors.dob && (
                            <p className="text-red-500 text-sm">{errors.dob}</p>
                        )}
                    </div>

                    {/* Profile Image */}
                    <div>
                        <label className="block text-sm font-medium">Profile Image</label>
                        <div className="mt-1">
                            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100">
                                {profilePreviewImage ? (
                                    <img
                                        src={profilePreviewImage}
                                        alt="Profile Preview"
                                        className="object-cover h-full w-full rounded-lg"
                                    />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        Click to upload
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setProfileImage(file);
                                            setProfilePreviewImage(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        {errors.profileImage && (
                            <p className="text-red-500 text-sm">{errors.profileImage}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
