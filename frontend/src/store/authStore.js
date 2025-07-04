import { create } from "zustand";
import api from "../api";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
// authstore file
// Add axios interceptor for session expiration
let isSessionExpired = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.data?.message === "SESSION_EXPIRED" &&
      !isSessionExpired &&
      useAuthStore.getState().isAuthenticated
    ) {
      isSessionExpired = true;
      toast.error("Your session has expired. Please login again.");
      useAuthStore.getState().clearAuth();
      setTimeout(() => {
        isSessionExpired = false;
      }, 5000);
    }
    return Promise.reject(error);
  }
);

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  profileImage: null,

  setUser: (user) => {
    if (import.meta.env.MODE === "production") {
      console.log("🟠 [PROD] setUser called with:", user);
      console.log("🟠 [PROD] Profile image in user data:", user?.profileImage);
    }
    set({ 
      user, 
      isAuthenticated: true, 
      isLoading: false,
      profileImage: user?.profileImage || null 
    });
    if (import.meta.env.MODE === "production") {
      console.log("🟠 [PROD] User state set successfully");
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setProfileImage: (profileImage) => set((state) => ({
    profileImage,
    user: state.user ? { ...state.user, profileImage } : null
  })),

  fetchUser: async () => {
    if (import.meta.env.MODE === "production") {
      console.log("🟠 [PROD] fetchUser called");
      console.log("🟠 [PROD] Document.cookie before API call:", document.cookie);
    }
    try {
      const { data } = await api.get("/auth/get-profile");
      if (import.meta.env.MODE === "production") {
        console.log("🟠 [PROD] API response from /auth/get-profile:", data);
      }
      if (data?.user) {
        if (import.meta.env.MODE === "production") {
          console.log("🟠 [PROD] User data received:", data.user);
          console.log("🟠 [PROD] Profile image from API:", data.user.profileImage);
        }
        set({ 
          user: data.user, 
          isAuthenticated: true, 
          isLoading: false,
          profileImage: data.user.profileImage || null 
        });
        if (import.meta.env.MODE === "production") {
          console.log("🟠 [PROD] User state updated successfully");
        }
        return true;
      } else {
        if (import.meta.env.MODE === "production") {
          console.log("🟠 [PROD] No user data in response");
        }
        set({ user: null, isAuthenticated: false, isLoading: false, profileImage: null });
        return false;
      }
    } catch (error) {
      if (import.meta.env.MODE === "production") {
        console.error("🟠 [PROD] Error fetching user:", error);
        console.error("🟠 [PROD] Error response:", error.response?.data);
        console.error("🟠 [PROD] Error status:", error.response?.status);
        console.log("🟠 [PROD] Document.cookie during error:", document.cookie);
      }
      set({ user: null, isAuthenticated: false, isLoading: false, profileImage: null });
      return false;
    }
  },

  logout: async () => {
    try {
      // Call backend logout API
      await api.post("/auth/logout");

      // Sign out from Firebase (if applicable)
      await signOut(auth);

      // Clear Zustand state
      set({ user: null, isAuthenticated: false, profileImage: null });
    } catch (error) {
      console.error("Logout error:", error);
      set({ user: null, isAuthenticated: false, profileImage: null });
    }
  },

  uploadProfileImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post(
        "/users/upload-profile-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update both user and profileImage state
      set((state) => ({
        user: state.user ? { ...state.user, profileImage: data.profileImage } : null,
        profileImage: data.profileImage
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
      await api.delete("/users/delete-profile-image");

      // Update both user and profileImage state
      set((state) => ({
        user: state.user ? { ...state.user, profileImage: null } : null,
        profileImage: null
      }));

      return true;
    } catch (err) {
      console.error("Error deleting profile image:", err);
      throw new Error("Failed to delete profile image");
    }
  },

  deleteUser: async () => {
    try {
      // Call backend API to delete user
      await api.delete("/users/delete-user");

      // Sign out from Firebase (if applicable)
      await signOut(auth);

      // Clear Zustand state
      set({ user: null, isAuthenticated: false, profileImage: null });

      console.log("User deleted successfully.");
    } catch (err) {
      console.error("Error deleting user:", err);
      throw new Error("Failed to delete user. Please try again.");
    }
  },

  clearAuth: () => set({ user: null, isAuthenticated: false, profileImage: null }),
}));

export default useAuthStore;
