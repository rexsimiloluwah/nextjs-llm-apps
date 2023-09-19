"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./ui/toaster";

interface Props {}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      {children}
    </ThemeProvider>
  );
};

export default Providers;
