import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import Modal from "../components/Modal";

const UpdateProfilePage = () => {
  const {
    user,
    profileImage,
    uploadProfileImage,
    deleteProfileImage,
    setUser,
    setProfileImage,
  } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [loadingDeleteImage, setLoadingDeleteImage] = useState(false);
  const [formData, setFormData] = useState({
    newUsername: "",
    newEmail: "",
    oldPassword: "",
    newPassword: "",
  });
  const [activeTab, setActiveTab] = useState("image");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agreeDelete, setAgreeDelete] = useState(false);
  const navigate = useNavigate();

  // Username validation regex
  const usernameRegex = /^(?!.*@)[a-zA-Z0-9_]{3,20}$/;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const newProfileImage = await uploadProfileImage(file);
        setProfileImage(newProfileImage);
        setUser({ ...user, profileImage: newProfileImage });
        toast.success("Profile picture updated successfully!");
      } catch (error) {
        toast.error("Failed to upload profile image. Please try again.");
      }
    }
  };

  const handleDeleteImage = async () => {
    setLoadingDeleteImage(true);
    try {
      await deleteProfileImage();
      toast.success("Profile image deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete profile image.");
    } finally {
      setLoadingDeleteImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { newUsername, newEmail, oldPassword, newPassword } = formData;
    const errors = [];

    if (newUsername && !usernameRegex.test(newUsername)) {
      errors.push(
        "Username must be 3-20 characters, can only contain letters, numbers, and underscores, and cannot contain @ symbol"
      );
    }

    if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      errors.push("Invalid email format");
    }

    if (newPassword && oldPassword === newPassword) {
      errors.push("New password must be different from old password");
    }

    if (
      newPassword &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        newPassword
      )
    ) {
      errors.push(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      );
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    // Check if at least one field is filled
    const { newUsername, newEmail, oldPassword, newPassword } = formData;
    if (!newUsername && !newEmail && !newPassword) {
      toast.error("Please fill in at least one field to update");
      return;
    }

    // If updating password, require old password
    if (newPassword && !oldPassword) {
      toast.error("Old password is required to update password");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put("/users/update-profile", formData, {
        withCredentials: true,
      });
      if (data?.message) {
        toast.success(data.message);
        // Update local user state if username or email was changed
        if (newUsername || newEmail) {
          setUser({
            ...user,
            username: newUsername || user.username,
            email: newEmail || user.email,
          });
        }
        // Delay navigation to allow toast to show before redirect
        setTimeout(() => {
          navigate("/");
        }, 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await api.delete("/users/delete-user", { withCredentials: true });
      await signOut(auth);
      setUser(null);
      setProfileImage(null);
      toast.success("Profile deleted successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete profile.");
    }
  };

  const tabs = [
    { key: "image", label: "Profile Picture" },
    { key: "update", label: "Update Credentials" },
    { key: "delete", label: "Delete Profile" },
  ];

  return (
    <div className="min-h-screen px-6 py-10">
      <h1
        className="text-3xl md:text-4xl font-extrabold text-orange-500 text-center drop-shadow-sm mb-10"
        style={{
          fontFamily: `'Dancing Script', 'Pacifico', 'Great Vibes', cursive, 'Playfair Display', serif`,
        }}
      >
        Manage Your Profile
      </h1>

      <div className="flex justify-center space-x-4 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-6 py-2 font-semibold rounded-full transition ${
              activeTab === tab.key
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-white text-orange-500 border border-orange-300 hover:bg-orange-100"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto">
        {/* 1. Profile Image Section */}
        {activeTab === "image" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-orange-500 text-center mb-4">
              Delete Profile Image
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-700 text-base text-justify"
            >
              Your profile image is your identity on Custom Crave. You can
              change it anytime to keep your profile fresh and personal. If you
              delete your profile image, your account will revert to a default
              avatar. This will not affect your meal plans or account data.{" "}
              <br />
              <br />
              <span className="font-semibold text-orange-500">Tip:</span>{" "}
              Keeping your profile image updated helps your friends and our
              support team recognize you easily!
            </motion.p>
            <div className="flex justify-center">
              <button
                onClick={handleDeleteImage}
                type="button"
                className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition 
                  ${
                    loadingDeleteImage
                      ? "bg-red-500 text-white border-red-500"
                      : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  }`}
                style={{
                  transition: "all 0.2s",
                }}
                onMouseDown={(e) =>
                  e.currentTarget.classList.add("bg-red-500", "text-white")
                }
                onMouseUp={(e) =>
                  e.currentTarget.classList.remove("bg-red-500", "text-white")
                }
              >
                {loadingDeleteImage ? "Deleting..." : "Delete Image"}
              </button>
            </div>
          </motion.div>
        )}

        {/* 2. Update Credentials Section */}
        {activeTab === "update" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 w-full max-w-md mx-auto"
          >
            <h2 className="text-xl font-bold text-orange-500 text-center mb-4">
              Update Credentials
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-700 text-base text-justify mb-6"
            >
              You can update your username, email, or password independently.
              Fill in only the fields you want to update.
              <br />
              <br />
              <span className="font-semibold text-orange-500">Note:</span> If
              you're updating your password, you'll need to provide your old
              password.
            </motion.p>
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-4"
            >
              {[
                {
                  name: "newUsername",
                  label: "New Username",
                  type: "text",
                  placeholder: "Leave empty to keep current",
                  autoComplete: "off",
                },
                {
                  name: "newEmail",
                  label: "New Email",
                  type: "email",
                  placeholder: "Leave empty to keep current",
                  autoComplete: "new-email",
                },
                {
                  name: "oldPassword",
                  label: "Old Password",
                  type: "password",
                  placeholder: "Required only for password update",
                  autoComplete: "off",
                },
                {
                  name: "newPassword",
                  label: "New Password",
                  type: "password",
                  placeholder: "Leave empty to keep current",
                  autoComplete: "new-password",
                },
              ].map((field) => (
                <div key={field.name}>
                  <p className="text-sm font-semibold mb-1">{field.label}</p>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={
                  loading ||
                  (!formData.newUsername &&
                    !formData.newEmail &&
                    !formData.newPassword)
                }
                className={`w-full py-3 font-semibold rounded-full transition 
                  ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </motion.div>
        )}

        {/* 3. Delete Profile Section */}
        {activeTab === "delete" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <h2 className="text-xl font-bold text-orange-500">
              Delete Profile
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-700 text-base text-justify"
            >
              Deleting your profile will permanently remove all your data from
              Custom Crave, including your meal plans, preferences, saved
              recipes, and any other personalized features we offer. This action
              cannot be undone.
              <br />
              <br />
              <span className="font-semibold text-orange-500">
                Why delete your profile?
              </span>{" "}
              Sometimes users want a fresh start, wish to remove their data for
              privacy, or simply no longer wish to use our service.
              <br />
              <br />
              <span className="font-semibold text-orange-500">
                Important:
              </span>{" "}
              Once deleted, you will lose access to all your meal plans,
              nutrition history, and any benefits or features provided by Custom
              Crave.
              <br />
              <br />
              We apologize that you are leaving our project. We hope you'll come
              back again and let us impress you even more in the future!
            </motion.p>
            <div className="flex flex-col items-center space-y-4">
              <label className="flex items-center space-x-2 text-sm text-gray-700 text-justify">
                <input
                  type="checkbox"
                  checked={agreeDelete}
                  onChange={(e) => setAgreeDelete(e.target.checked)}
                  className="accent-orange-500"
                />
                <span>
                  I have read all the instructions about deleting the profile.
                  And I am agree to delete.
                </span>
              </label>
              <button
                onClick={() => setShowDeleteModal(true)}
                type="button"
                disabled={!agreeDelete}
                className={`w-full py-3 font-semibold rounded-full border-2 transition
                  ${
                    !agreeDelete
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  }`}
                style={{
                  transition: "all 0.2s",
                }}
                onMouseDown={(e) => {
                  if (agreeDelete) {
                    e.currentTarget.classList.add("bg-red-500", "text-white");
                  }
                }}
                onMouseUp={(e) => {
                  if (agreeDelete) {
                    e.currentTarget.classList.remove(
                      "bg-red-500",
                      "text-white"
                    );
                  }
                }}
              >
                Delete My Profile
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {showDeleteModal && (
        <Modal
          title="Delete Profile"
          message="Are you sure you want to delete your profile? This action is permanent and cannot be undone."
          onConfirm={() => {
            setShowDeleteModal(false);
            handleDeleteProfile();
          }}
          onCancel={() => setShowDeleteModal(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default UpdateProfilePage;
