"use client";

import { useEffect, useState } from "react";
import { Dot } from "@/components/ui-system/primitives";

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
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] dark:bg-white/5 dark:backdrop-blur-sm"
    >
      <Dot />
      {theme === null ? "Theme" : theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
