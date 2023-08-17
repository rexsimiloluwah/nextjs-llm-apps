import Link from "next/link";
import React from "react";
import { GithubIcon } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-sm shadow-sm border-b border-slate-300 h-20 flex justify-center px-6">
      <nav className="container max-w-7xl flex justify-between items-center">
        <Link href="/">Chat with Docs</Link>
        <Link
          href="https://github.com"
          target="_blank"
          className="hover:bg-neutral-200 rounded-full p-3"
        >
          <GithubIcon size={24} />
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
