"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sovereign-theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="rounded-full border border-stone-700 bg-stone-950 px-4 py-2 text-sm font-medium text-stone-300 transition hover:border-stone-500 hover:text-white"
    >
      {theme === null ? "Theme" : theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
