import React, { createContext, useState, useEffect, useMemo } from "react";

// Create the context with a default value
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // State to hold the current theme, defaulting to the user's system preference or 'light'
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem("theme") || "light"
  );

  // Effect to apply the theme class to the body and save to local storage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
