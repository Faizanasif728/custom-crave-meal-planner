import { create } from "zustand";
import axios from "../api";
import { toast } from "react-toastify";

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

  setUser: (user) => set({ 
    user, 
    isAuthenticated: true, 
    isLoading: false,
    profileImage: user?.profileImage || null 
  }),

  setProfileImage: (profileImage) => set((state) => ({
    profileImage,
    user: state.user ? { ...state.user, profileImage } : null
  })),

  fetchUser: async () => {
    try {
      const { data } = await axios.get("/auth/get-profile", {
        withCredentials: true,
      });
      if (data?.user) {
        set({ 
          user: data.user, 
          isAuthenticated: true, 
          isLoading: false,
          profileImage: data.user.profileImage || null 
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ user: null, isAuthenticated: false, isLoading: false, profileImage: null });
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
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

  clearAuth: () => set({ user: null, isAuthenticated: false, profileImage: null }),
}));

export default useAuthStore;
