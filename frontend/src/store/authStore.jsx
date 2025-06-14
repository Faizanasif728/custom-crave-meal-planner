import { create } from "zustand";
import axios from "../api";
import { signOut } from "firebase/auth"; // ✅ Import signOut
import { auth } from "../config/firebaseConfig"; // ✅ Import Firebase auth instance

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  profileImage: null,

  setUser: (user) =>
    set({
      user,
      profileImage: user?.profileImage || null,
    }),

  setLoading: (loading) => set({ loading }),

  setProfileImage: (profileImage) =>
    set((state) => ({
      profileImage,
      user: state.user ? { ...state.user, profileImage } : null,
    })),

  fetchUser: async () => {
    try {
      const { data } = await axios.get("/auth/get-profile", {
        withCredentials: true,
      });
      if (data?.user) {
        set({
          user: data.user,
          profileImage: data.user.profileImage,
          loading: false,
        });
      } else {
        set({ user: null, profileImage: null, loading: false });
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      // Clear state on any error
      set({ user: null, profileImage: null, loading: false });
    }
  },

  logout: async () => {
    try {
      // Call backend logout API
      await axios.post("/auth/logout", {}, { withCredentials: true });

      // Sign out from Firebase (if applicable)
      await signOut(auth);

      // Clear Zustand state
      set({ user: null, profileImage: null });
    } catch (err) {
      console.error("Error logging out:", err);
      throw new Error("Failed to log out. Please try again.");
    }
  },

  uploadProfileImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        "/users/upload-profile-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      // Update both profileImage and user state
      set((state) => ({
        profileImage: data.profileImage,
        user: state.user
          ? { ...state.user, profileImage: data.profileImage }
          : null,
      }));

      return data.profileImage;
    } catch (err) {
      console.error(
        "Error uploading profile image:",
        err.response?.data?.message || err.message
      );
      throw new Error(
        err.response?.data?.message || "Failed to upload profile image"
      );
    }
  },

  deleteProfileImage: async () => {
    try {
      await axios.delete("/users/delete-profile-image", {
        withCredentials: true,
      });
      // Set profileImage to null so UI shows first letter avatar
      set((state) => ({
        profileImage: null,
        user: state.user ? { ...state.user, profileImage: null } : null,
      }));
      return true;
    } catch (err) {
      console.error("Error in deleteProfileImage:", err);
      throw new Error("Failed to delete profile image");
    }
  },

  deleteUser: async () => {
    try {
      // Call backend API to delete user
      await axios.delete("/users/delete-user", { withCredentials: true });

      // Sign out from Firebase (if applicable)
      await signOut(auth);

      // Clear Zustand state
      set({ user: null, profileImage: null });

      console.log("User deleted successfully.");
    } catch (err) {
      console.error("Error deleting user:", err);
      throw new Error("Failed to delete user. Please try again.");
    }
  },
}));

export default useAuthStore;
