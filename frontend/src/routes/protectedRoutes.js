import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api"; // Import the axios instance

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/auth/verify-session"); // Backend route to check auth status
        setAuthState({
          isAuthenticated: true,
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  if (authState.isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading state
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
