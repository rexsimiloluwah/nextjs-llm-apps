import Link from "next/link";
import React from "react";
import { GithubIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { buttonVariants } from "./ui/button";

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-sm shadow-sm border-b border-slate-300 h-20 flex justify-center px-6">
      <nav className="container max-w-7xl flex justify-between items-center">
        <div className="font-semibold cursor-pointer hover:underline text-xl">
          {title}
        </div>
        <div className="flex gap-x-4 items-center">
          <Link
            href="/"
            className="hover:underline hover:underline-offset-2 hover:font-semibold"
          >
            Home
          </Link>
          <Link
            href="https://github.com/rexsimiloluwah/nextjs-llm-apps"
            target="_blank"
            className={buttonVariants({ variant: "ghost" })}
          >
            <GithubIcon size={24} className="group-hover:text-secondary" />
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
