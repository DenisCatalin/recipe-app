"use client";

import { useState, useEffect } from "react";
import { lightTheme, darkTheme } from "../styles/theme";

const THEME_KEY = "recipe-app-theme";

export function useTheme() {
  const [theme, setTheme] = useState(lightTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      const isDark = savedTheme === "dark";
      setIsDarkMode(isDark);
      setTheme(isDark ? darkTheme : lightTheme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
    setTheme(prefersDark ? darkTheme : lightTheme);
    localStorage.setItem(THEME_KEY, prefersDark ? "dark" : "light");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      setTheme(e.matches ? darkTheme : lightTheme);
      localStorage.setItem(THEME_KEY, e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    setTheme(newIsDarkMode ? darkTheme : lightTheme);
    localStorage.setItem(THEME_KEY, newIsDarkMode ? "dark" : "light");
  };

  return { theme, isDarkMode, toggleTheme };
}
