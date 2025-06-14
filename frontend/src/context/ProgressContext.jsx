import React, { createContext, useContext, useState } from "react";

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(0); // Starts from 0

  // Define the steps for the progress bar
  const steps = [
    "/setup-account",
    "/your-diet",
    "/calories-application",
    "/calories-result",
    "/weight-goal",
    "/dietary-type",
    "/meal-type",
    "/number-of-days",
  ];

  // Function to calculate progress dynamically
  const calculateProgress = (currentPath) => {
    const currentIndex = steps.indexOf(currentPath);
    if (currentIndex === -1) return 0; // Default to 0% if the path is not found
    return ((currentIndex + 1) / steps.length) * 100; // Calculate percentage
  };

  return (
    <ProgressContext.Provider
      value={{ progress, setProgress, calculateProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
