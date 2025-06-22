import { create } from "zustand";
import axios from "../api";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

// Add axios interceptor for session expiration
let isSessionExpired = false;

axios.interceptors.response.use(
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
    }
    try {
      const { data } = await axios.get("/auth/get-profile", {
        withCredentials: true,
      });
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
      }
      set({ user: null, isAuthenticated: false, isLoading: false, profileImage: null });
      return false;
    }
  },

  logout: async () => {
    try {
      // Call backend logout API
      await axios.post("/auth/logout", {}, { withCredentials: true });

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

      const { data } = await axios.post(
        "/users/upload-profile-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
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
      await axios.delete("/users/delete-profile-image", {
        withCredentials: true,
      });

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
      await axios.delete("/users/delete-user", { withCredentials: true });

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
