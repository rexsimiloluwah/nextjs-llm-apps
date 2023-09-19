"use client";
import React from "react";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  const handleChangeTheme = () => {
    if (theme == "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button variant="ghost" onClick={handleChangeTheme}>
      <MoonIcon className="absolute rotate-90 scale-0 transition-all hover:text-slate-900 dark:rotate-0 dark:scale-100 dark:text-slate-400 dark:hover:text-slate-100 w-5 h-5" />
      <SunIcon className="rotate-0 scale-100 transition-all hover:text-slate-900  dark:-rotate-90 dark:scale-0 dark:text-slate-400 dark:hover:text-slate-100 w-5 h-5" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
};

export default ThemeToggle;
