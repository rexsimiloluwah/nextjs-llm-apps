import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ChatWithKati from "./components/ChatWithKati";

export const metadata: Metadata = {
  title: "QA with Kati Frantz",
  description: "AI-Powered QA with Kati Frantz Newsletters",
  icons: {
    icon: "/images/katifrantz.jpg",
  },
};

export default function page() {
  return (
    <>
      <Navbar title="Chat with Kati Frantz" />
      <ChatWithKati />
    </>
  );
}
